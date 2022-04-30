<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\JwtAuth;
use App\Services\PedidoService;
use App\Entity\LineasPedido;
use App\Entity\Pedido;
use App\Entity\Libro;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;

class PedidoController extends AbstractController
{
    private function resjson($data){
        $json = $this->get('serializer')->serialize($data, 'json');

        $response = new Response();

        $response->setContent($json);

        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function myOrders(Request $request, JwtAuth $jwt_auth){
        $token = $request->headers->get('Authorization');

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al hacer el pedido'
        ];

        $auth = $jwt_auth->checkToken($token);

        if($auth){
            $identity = $jwt_auth->checkToken($token, true);
            $doctrine = $this->getDoctrine();
            
            $pedidos = $doctrine->getRepository(Pedido::class)->findBy(['idCliente' => $identity->sub]);

            if(count($pedidos) > 0){
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'pedidos' => $pedidos
                ];
            } else if(count($pedidos) == 0){
                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'No tienes pedidos',
                    'pedidos' => 'nope'
                ];
            }
        }
        return $this->resjson($data);
    }

    public function add(Request $request, JwtAuth $jwt_auth, PedidoService $pedido_service, $idLibro = null){
        $token = $request->headers->get('Authorization');

        $json = $request->get('json', null);
        $json = str_replace("\"{", "{", $json);
        $json = str_replace("}\"", "}", $json);
        $json = str_replace("\"[", "[", $json);
        $json = str_replace("]\"", "]", $json);
        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al hacer el pedido'
        ];

        $auth = $jwt_auth->checkToken($token);


        if($auth){
            $identity = $jwt_auth->checkToken($token, true);
            
            $user_repo = $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy(['id' => $identity->sub]);
            $libro = $this->getDoctrine()->getRepository(Libro::class)->findOneBy(['id' => $idLibro]);

            $pedido = new Pedido();
            $pedido->setIdCliente($user);


            $lineas = $params->lineas;
            $lineas = json_decode(json_encode($lineas), true);
            if(is_string($lineas)){
                $lineas = array();
            }
            

            $linea = $pedido_service->add($pedido, 1, $libro);

            $count = count($lineas);
            $add = false;

            for($c=0;$c<$count;$c++){
                if(isset($lineas[$c])){
                    if($lineas[$c]['idLibro']['id'] == $linea->getIdLibro()->getId()){
                        $cantidad = $lineas[$c]['cantidad'];
                        $cantidad = $cantidad+1;
                        $lineas[$c]['cantidad'] = $cantidad;
                        $add = true;
                    }
                }
            }

            if($add == false){
                 array_push($lineas, $linea);
                }
            

            $data = [
                'status' => 'success',
                'code' => 200,
                'message' => 'Pedido actualizado',
                'pedido' => $pedido,
                'lineas' => $lineas
            ];
        }
        return $this->resjson($data);
    }

    public function endOrder(Request $request, JwtAuth $jwt_auth){
        $token = $request->headers->get('Authorization');

        $json = $request->get('json', null);
        $params = json_encode($json);
        $json = str_replace("\"{", "{", $json);
        $json = str_replace("}\"", "}", $json);
        $json = str_replace("\"[", "[", $json);
        $json = str_replace("]\"", "]", $json);
        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al hacer el pedido'
        ];

        $auth = $jwt_auth->checkToken($token);

        if($auth){
            $identity = $jwt_auth->checkToken($token, true);

            
            $doctrine = $this->getDoctrine();
            $em = $doctrine->getManager();

            $user_repo = $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy(['id' => $identity->sub]);

            $pedido = $params->pedido;

            $importe = 0;
            $lineas = $params->lineas;

            $lineas = json_decode(json_encode($lineas), true);
            $pedido = json_decode(json_encode($pedido), true);

            $pedidoE = new Pedido();
            $pedidoE->setIdCliente($user);
            $pedidoE->setImporte(0);


            $em->persist($pedidoE);
            $em->flush();


            $importe = 0;
            for($c=0; $c<count($lineas); $c++){
                $lineasE[$c] = new LineasPedido();
                $lineasE[$c]->setIdPedido($pedidoE); 
                $libro = $this->getDoctrine()->getRepository(Libro::class)->findOneBy(['id' => $lineas[$c]['idLibro']['id']]);
                $lineasE[$c]->setIdLibro($libro);
                $lineasE[$c]->setCantidad($lineas[$c]['cantidad']);
                $lineasE[$c]->setCoste($lineas[$c]['coste']*$lineas[$c]['cantidad']);
                $importe = $importe+($lineas[$c]['coste']*$lineas[$c]['cantidad']);
                $em->persist($lineasE[$c]);
                $em->flush();
            }

            $pedidoI = $this->getDoctrine()->getRepository(Pedido::class)->findOneBy(['id' => $pedidoE->getId()]);
            $pedidoI->setImporte($importe);
            $em->persist($pedidoI);
            $em->flush();
            

            $data = [
                'status' => 'success',
                'code' => 200,
                'message' => 'Pedido finalizado',
                'pedido' => $pedido,
                'lineas' => $lineas
            ];

            return $this->resjson($data);
        }
    }

    public function showOrder(Request $request, JwtAuth $jwt_auth, $idpedido = 0){
        $token = $request->headers->get('Authorization');

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al mostrar pedido'
        ];

        $auth = $jwt_auth->checkToken($token);

        if($auth){
            $identity = $jwt_auth->checkToken($token, true);

            $doctrine = $this->getDoctrine();
            $lineas = $doctrine->getRepository(LineasPedido::class)->findBy(['idPedido' => $idpedido]);

            $data = [
                'status' => 'success',
                'code' => 200,
                'lineas' => $lineas
            ];
        }

        return $this->resjson($data);
    }

    public function editOrder(Request $request, JwtAuth $jwt_auth, $idlinea = 28, $cantidad = 5) {
        $token = $request->headers->get('Authorization');

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al hacer el pedido'
        ];

        $auth = $jwt_auth->checkToken($token);

        if($auth && !empty($idlinea)){
            $doctrine = $this->getDoctrine();
            $linea = $doctrine->getRepository(LineasPedido::class)->findOneBy(['id' => $idlinea]);
            
            if($cantidad != null){
                $linea->setCantidad($cantidad);
            }
            $coste = $linea->getCantidad()*$libro->getPrecio();
            $linea->setCoste($coste);

            $data = [
                'status' => 'success',
                'code' => 200,
                'linea' => $linea
            ];
        }

        return $this->resjson($data);
    }

    public function cancelOrder(Request $request, JwtAuth $jwt_auth, $idPedido = null){
        $token = $request->headers->get('Authorization');

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al cancelar el pedido'
        ];

        $auth = $jwt_auth->checkToken($token);

        if($auth){
            $doctrine = $this->getDoctrine();
            $em = $doctrine->getManager();

            $pedido = $doctrine->getRepository(Pedido::class)->findOneBy(['id' => $idPedido]);
            $lineas = $doctrine->getRepository(LineasPedido::class)->findBy(['idPedido' => $idPedido]);

            for($c=0;count($lineas)>$c;$c++){
                $em->remove($lineas[$c]);
            }

            $em->remove($pedido);
            $em->flush();

            $data = [
                'status' => 'success',
                'code' => 200,
                'message' => 'Pedido cancelado'
            ];
        }
        return $this->resjson($data);
    }

    public function moreOrless(Request $request, JwtAuth $jwt_auth){
        $token = $request->headers->get('Authorization');

        $json = $request->get('json', null);
        $params = json_encode($json);
        $json = str_replace("\"{", "{", $json);
        $json = str_replace("}\"", "}", $json);
        $json = str_replace("\"[", "[", $json);
        $json = str_replace("]\"", "]", $json);
        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al hacer el pedido'
        ];

        $auth = $jwt_auth->checkToken($token);

        if($auth){
            $idLibro = $params->idLibro;
            $button = $params->button;

            $identity = $jwt_auth->checkToken($token, true);
            
            $user_repo = $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy(['id' => $identity->sub]);
            $libro = $this->getDoctrine()->getRepository(Libro::class)->findOneBy(['id' => $idLibro]);

            $pedido = new Pedido();
            $pedido->setIdCliente($user);

            $lineas = json_decode(json_encode($params->lineas), true);   


            $count = count($lineas);

            for($c=0;$c<$count;$c++){
                if(isset($lineas[$c])){
                    if($lineas[$c]['idLibro']['id'] == $idLibro){
                        $cantidad = $lineas[$c]['cantidad'];
                        if($button == "+"){
                            $cantidad = $cantidad+1;
                        } else if($button == "-"){
                            $cantidad = $cantidad-1;
                        }
                        $lineas[$c]['cantidad'] = $cantidad;
                        $add = true;
                    }
                }
            }
            

            $data = [
                'status' => 'success',
                'code' => 200,
                'message' => 'Pedido actualizado',
                'pedido' => $pedido,
                'lineas' => $lineas
            ];
        }
        return $this->resjson($data);
    }

    public function getLineasByPedido($idPedido = null){
        $lineas = $this->getDoctrine()->getRepository(LineasPedido::class)->findBy(['idPedido' => $idPedido]);

        $data = [
            'status' => 'success',
            'code' => 200,
            'lineas' => $lineas,
        ];

        return $this->resjson($data);
    }
}
