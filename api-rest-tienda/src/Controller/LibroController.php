<?php

namespace App\Controller;

use App\Entity\Libro;
use App\Entity\LineasPedido;
use App\Entity\Review;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LibroController extends AbstractController
{
    private function resjson($data){
        $json = $this->get('serializer')->serialize($data, 'json');

        $response = new Response();

        $response->setContent($json);

        $response->headers->set('Content-Type', 'application/json');

        return $response;
    }

    public function getBooks(){
        $books = $this->getDoctrine()->getRepository(Libro::class)->findAll();

        $data = [
            'status' => 'success',
            'code' => 200,
            'books' => $books
        ];

        return $this->resjson($data);
    }

    public function getBook($id = null){
        $book = $this->getDoctrine()->getRepository(Libro::class)->findOneBy(['id' => $id]);

        $data = [
            'status' => 'success',
            'code' => 200,
            'book' => $book
        ];

        return $this->resjson($data);
    }

    public function search(Request $request, $search = null){
        $busqueda = (!empty($search)) ? $search : null;

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'No hay resultados de búsqueda'
        ];

        $resultado = $this->getDoctrine()->getRepository(Libro::class)->createQueryBuilder('l')
                                         ->where('l.titulo LIKE :busqueda')
                                         ->orWhere('l.autor LIKE :busqueda')
                                         ->setParameter('busqueda', '%'.$busqueda.'%')
                                         ->getQuery()
                                         ->getResult();

        $data = [
            'status' => 'success',
            'code' => 200,
            'books' => $resultado
        ];

        return $this->resjson($data);
    }

    public function create(Request $request){
        $json = $request->get('json');

        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'El libro no se ha creado'
        ];

        if($json != null){
            $titulo = (!empty($params->titulo)) ? $params->titulo : null;
            $descripcion = (!empty($params->descripcion)) ? $params->descripcion : null;
            $isbn = (!empty($params->isbn)) ? $params->isbn : null;
            $categoria = (!empty($params->categoria)) ? $params->categoria : null;
            $precio = (!empty($params->precio)) ? $params->precio : null;
            $autor = (!empty($params->autor)) ? $params->autor : null;

            if(!empty($titulo) && !empty($descripcion) && !empty($isbn) && !empty($categoria) && !empty($precio) && !empty($autor)){
                $libro = new Libro();
                $libro->setTitulo($titulo);
                $libro->setDescripcion($descripcion);
                $libro->setIsbn($isbn);
                $libro->setCategoria($categoria);
                $libro->setPrecio($precio);
                $libro->setAutor($autor);

                $doctrine = $this->getDoctrine();
                $em = $doctrine->getManager();
                $libro_repo = $doctrine->getRepository(Libro::class);

                    $em->persist($libro);
                    $em->flush();

                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El libro se ha creado correctamente',
                    'libro' => $libro
                ];
            }
        }
        return $this->resjson($data);
    }

    public function edit(Request $request, $id = null){
        $json = $request->get('json');

        $params = json_decode($json);

        $data = [
            'status' => 'error',
            'code' => 400,
            'message' => 'El libro no se ha editado'
        ];

        if($json != null){
            $titulo = (!empty($params->titulo)) ? $params->titulo : null;
            $descripcion = (!empty($params->descripcion)) ? $params->descripcion : null;
            $isbn = (!empty($params->isbn)) ? $params->isbn : null;
            $categoria = (!empty($params->categoria)) ? $params->categoria : null;
            $precio = (!empty($params->precio)) ? $params->precio : null;
            $autor = (!empty($params->autor)) ? $params->autor : null;

            if(!empty($titulo) && !empty($descripcion) && !empty($isbn) && !empty($categoria) && !empty($precio) && !empty($autor)){
                $libro = $this->getDoctrine()->getRepository(Libro::class)->findOneBy(['id' => $id]);
                $libro->setTitulo($titulo);
                $libro->setDescripcion($descripcion);
                $libro->setIsbn($isbn);
                $libro->setCategoria($categoria);
                $libro->setPrecio($precio);
                $libro->setAutor($autor);

                $doctrine = $this->getDoctrine();
                $em = $doctrine->getManager();

                    $em->persist($libro);
                    $em->flush();

                $data = [
                    'status' => 'success',
                    'code' => 200,
                    'message' => 'El libro se ha editado correctamente',
                    'libro' => $libro
                ];
            }
        }
        return $this->resjson($data);
    }

    public function tenMoreSold(){
        $masvendidos = $this->getDoctrine()->getRepository(LineasPedido::class)->createQueryBuilder('lp')
                                         ->groupBy('lp.idLibro')
                                         ->orderBy('SUM(lp.cantidad)', 'DESC')
                                         ->getQuery()
                                         ->setMaxResults(10)
                                         ->getResult();

        $data = [
            'status' => 'success',
            'code' => 200,
            'books' => $masvendidos
        ];

        return $this->resjson($data);
    }

    public function getBookScore($idLibro = null){
        $media = $this->getDoctrine()->getRepository(Review::class)->createQueryBuilder('r')
                                         ->select('AVG(r.score)')
                                         ->where('r.idLibro = '.$idLibro)
                                         ->getQuery()
                                         ->getResult();

        $media = $media[0][1];
        $media = (float)number_format($media, 2, '.', '');
        $data = [
            'status' => 'success',
            'code' => 200,
            'media' => $media
        ];

        return $this->resjson($data);
    }

    public function getHundredBest(){
        $cien_mejores = $this->getDoctrine()->getRepository(Review::class)->createQueryBuilder('r')
                                         ->groupBy('r.idLibro')
                                         ->orderBy('AVG(r.score)', 'DESC')
                                         ->setMaxResults(100)
                                         ->getQuery()
                                         ->getResult();
        $data = [
            'status' => 'success',
            'code' => 200,
            'besthundred' => $cien_mejores
        ];

        return $this->resjson($data);
    }

    public function getCategorias(){
        $categorias = $this->getDoctrine()->getRepository(Libro::class)->createQueryBuilder('l')
                                         ->select('l.categoria')
                                         ->groupBy('l.categoria')
                                         ->getQuery()
                                         ->getResult();
        $data = [
            'status' => 'success',
            'code' => 200,
            'categorias' => $categorias
        ];

        return $this->resjson($data);
    }

    public function getBooksByCategory($categoria = null){
        $libros = $this->getDoctrine()->getRepository(Libro::class)->findBy(['categoria' => $categoria]);

        $data = [
            'status' => 'success',
            'code' => 200,
            'libros' => $libros
        ];

        return $this->resjson($data);
    }

}
