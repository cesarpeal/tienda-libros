<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * LineasPedido
 *
 * @ORM\Table(name="lineas_pedido", indexes={@ORM\Index(name="fk_libro", columns={"id_libro"}), @ORM\Index(name="fk_pedido", columns={"id_pedido"})})
 * @ORM\Entity
 */
class LineasPedido
{
    /**
     * @var int
     *
     * @ORM\Column(name="id", type="integer", nullable=false)
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="IDENTITY")
     */
    private $id;

    /**
     * @var int
     *
     * @ORM\Column(name="cantidad", type="integer", nullable=false)
     */
    private $cantidad;

    /**
     * @var \Libro
     *
     * @ORM\ManyToOne(targetEntity="Libro")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_libro", referencedColumnName="id")
     * })
     */
    private $idLibro;

    /**
     * @var \Pedido
     *
     * @ORM\ManyToOne(targetEntity="App\Entity\Pedido")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="id_pedido", referencedColumnName="id")
     * })
     */
    private $idPedido;

    /**
     * @var int
     *
     * @ORM\Column(name="coste", type="integer", nullable=false)
     */
    private $coste;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCantidad(): ?int
    {
        return $this->cantidad;
    }

    public function setCantidad(int $cantidad): self
    {
        $this->cantidad = $cantidad;

        return $this;
    }

    public function getIdLibro(): ?Libro
    {
        return $this->idLibro;
    }

    public function setIdLibro(?Libro $idLibro): self
    {
        $this->idLibro = $idLibro;

        return $this;
    }

    public function getIdPedido(): ?Pedido
    {
        return $this->idPedido;
    }

    public function setIdPedido(?Pedido $idPedido): self
    {
        $this->idPedido = $idPedido;

        return $this;
    }

    public function getCoste(): ?int
    {
        return $this->coste;
    }

    public function setCoste(int $coste): self
    {
        $this->coste = $coste;

        return $this;
    }


}
