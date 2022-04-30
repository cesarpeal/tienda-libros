<?php

namespace App\Controller;

use App\Entity\Libro;
use App\Entity\Review;
use App\Entity\User;
use App\Services\JwtAuth;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class ReviewController extends AbstractController
{

    private function resjson($data){
        $json = $this->get('serializer')->serialize($data, 'json');

        $response = new Response();

        $response->setContent($json);

        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function create(Request $request, JwtAuth $jwt_auth, $idLibro = null){
        $token = $request->headers->get('Authorization');
        $json = $request->get('json');

        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'No se ha creado la review'
        ];

        $auth = $jwt_auth->checkToken($token);
        if($auth){
            $identity = $jwt_auth->checkToken($token, true);

            $doctrine = $this->getDoctrine();
            $em = $doctrine->getManager();

            $user = $doctrine->getRepository(User::class)->findOneBy(['id' => $identity->sub]);
            $libro = $doctrine->getRepository(Libro::class)->findOneBy(['id' => $idLibro]);
            $review_done = $doctrine->getRepository(Review::class)->findOneBy(['idLibro' => $idLibro, 'idUser' => $identity->sub]);

            if($review_done == null){
                $titulo = (!empty($params->titulo)) ? $params->titulo : null;
                $contenido = (!empty($params->contenido)) ? $params->contenido : null;
                $score = (!empty($params->score)) ? (int)$params->score : null;

                $review = new Review();
                $review->setIdUser($user);
                $review->setIdLibro($libro);
                $review->setContenido($contenido);
                $review->setScore($score);
                $review->setTitulo($titulo);

                $em->persist($review);
                $em->flush();

                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'review' => $review
                ];
            } else if(count($review_done == 1)){
                $data = [
                    'status' => 'error',
                    'code' => 400,
                    'message' => 'Ya has hecho una review',
                    'review_done' => $review_done
                ];
            }
        }
        return $this->resjson($data);
    }

    public function getBookReviews($idLibro = null){
        $reviews = $this->getDoctrine()->getRepository(Review::class)->findBy(['idLibro' => $idLibro]);
        $libro = $this->getDoctrine()->getRepository(Libro::class)->findOneBy(['id' => $idLibro]);
        $libro_titulo = $libro->getTitulo();

        $data = [
            'status' => 'success',
            'code' => 200,
            'reviews' => $reviews,
            'titulo' => $libro_titulo
        ];
        return $this->resjson($data);
    }

    public function reviewed(Request $request, JwtAuth $jwt_auth){
        $json = $request->get('json', null);
        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'Error'
        ];

        $params = json_decode($json);
        $libro = $params->idLibro;

        $token = $request->headers->get('Authorization');

        $auth = $jwt_auth->checktoken($token);

        if($auth){
            $identity = $jwt_auth->checktoken($token, true);
            $review = $this->getDoctrine()->getRepository(Review::class)->findOneBy(['idLibro' => $libro, 'idUser' => $identity->sub]);

            if($review){
               $data = [
                    'status' => 'success',
                    'code' => 200,
                    'review' => $review
               ]; 
            } else {
               $data = [
                    'status' => 'success',
                    'code' => 200,
                    'review' => 'false'
               ];    
            }
        }
        return $this->resjson($data);
    }
}
