<?php

namespace App\Controller;

use App\Entity\User;
use App\Services\JwtAuth;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Validator\Validation;
use Symfony\Component\Validator\Constraints\Email;

class UserController extends AbstractController
{

    private function resjson($data){
        $json = $this->get('serializer')->serialize($data, 'json');

        $response = new Response();

        $response->setContent($json);

        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getIdentity(Request $request, JwtAuth $jwt_auth){
        $token = $request->headers->get('Authorization');

        $token = str_replace("'", "", $token);
        $identity = $jwt_auth->checkToken($token, true);
        $user = $this->getDoctrine()->getRepository(User::class)->findOneBy(['id' => $identity->sub]);
        $data = [
            'status' => 'success',
            'code' => 200,
            'user' => $user
        ];
        return $this->resjson($data);
    }

    public function register(Request $request){
        $json = $request->get('json');

        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'El usuario no se ha creado'
        ];

        if($json != null){
            $nombre = (!empty($params->nombre)) ? $params->nombre : null;
            $apellidos = (!empty($params->apellidos)) ? $params->apellidos : null;
            $direccion = (!empty($params->direccion)) ? $params->direccion : null;
            $email = (!empty($params->email)) ? $params->email : null;
            $password = (!empty($params->password)) ? $params->password : null;

            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);

            if(!empty($email) && count($validate_email) == 0 && !empty($password) && !empty($nombre) && !empty($apellidos) && !empty($direccion)){
                $user = new User();
                $user->setNombre($nombre);
                $user->setApellidos($apellidos);
                $user->setDireccion($direccion);
                $user->setEmail($email);
                $pwd = hash('sha256', $password);
                $user->setPassword($pwd);

                $doctrine = $this->getDoctrine();
                $em = $doctrine->getManager();
                $user_repo = $doctrine->getRepository(User::class);
                $isset_user = $user_repo->findBy(array(
                    'email' => $email
                ));

                if(count($isset_user) == 0) {
                    $em->persist($user);
                    $em->flush();

                    $data = [
                        'status' => 'success',
                        'code' => 200,
                        'message' => 'El usuario se ha creado correctamente',
                        'user' => $user
                    ];
                } else {
                    $data = [
                        'status' => 'error',
                        'code' => 400,
                        'message' => 'El usuario ya existe'
                    ];
                }
            }
        }


        return $this->resjson($data);
    }

    public function login(Request $request, JwtAuth $jwt_auth){
        $json = $request->get('json', null);
        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error al identificarse'
        ];

        if(!empty($json)){
            $email = (!empty($params->email)) ? $params->email : null;
            $password = (!empty($params->password)) ? $params->password : null;
            $gettoken = (!empty($params->gettoken)) ? $params->gettoken : null;

            $validator = Validation::createValidator();
            $validate_email = $validator->validate($email, [
                new Email()
            ]);
        }


        if(!empty($email) && !empty($password) &&count($validate_email) == 0){
            $pwd = hash('sha256', $password);

            if($gettoken){
                $signup = $jwt_auth->signup($email, $pwd, $gettoken);
            } else {
                $signup = $jwt_auth->signup($email, $pwd);
            }

            return new JsonResponse($signup);
        }
    }

    public function edit(Request $request, JwtAuth $jwt_auth){
        $token = $request->headers->get('Authorization');

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'No se ha actualizado el usuario'
        ];

        $authCheck = $jwt_auth->checkToken($token);

        if($authCheck){
            $em = $this->getDoctrine()->getManager();

            $identity = $jwt_auth->checkToken($token, true);

            $user_repo = $this->getDoctrine()->getRepository(User::class);
            $user = $user_repo->findOneBy(['id' => $identity->sub]);

            $json = $request->get('json', null);
            $params = json_decode($json);

            if(!empty($json)){
                $nombre = (!empty($params->nombre)) ? $params->nombre : null;
                $apellidos = (!empty($params->apellidos)) ? $params->apellidos : null;
                $email = (!empty($params->email)) ? $params->email : null;
                $direccion = (!empty($params->direccion)) ? $params->direccion : null;

                $validator = Validation::createValidator();
                $validate_email = $validator->validate($email, [
                    new Email()
                ]);

                if(!empty($params->email) && count($validate_email) == 0 && !empty($params->nombre) && !empty($params->apellidos) && !empty($params->direccion)){
                    $user->setNombre($nombre);
                    $user->setApellidos($apellidos);
                    $user->setEmail($email);
                    $user->setDireccion($direccion);

                    $isset_user = $user_repo->findBy([
                        'email' => $email
                    ]);

                    if(count($isset_user) == 0 || $identity->email == $email){
                        $em->persist($user);
                        $em->flush();

                        $data = [
                            'status' => 'success',
                            'code' => 200,
                            'message' => 'Usuario actualizado',
                            'user' => $user
                        ];
                    }else{
                        $data = [
                            'status' => 'error',
                            'code' => 400,
                            'message' => 'No puedes usar ese email'
                        ];
                    }
                }
            }
        }
        return $this->resjson($data);
    }

}
