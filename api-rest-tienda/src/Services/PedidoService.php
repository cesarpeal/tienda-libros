<?php
namespace App\Services;

use App\Entity\LineasPedido;
use App\Entity\Pedido;
use App\Entity\Libro;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class PedidoService extends AbstractController{
	public function add(Pedido $pedido, $cantidad = null, Libro $libro){
		$coste = $libro->getPrecio($libro)*$cantidad;

		$linea = new LineasPedido();
		$linea->setIdPedido($pedido);
		$linea->setCantidad($cantidad);
		$linea->setIdLibro($libro);
		$linea->setCoste($coste);

		return $linea;
	}
}