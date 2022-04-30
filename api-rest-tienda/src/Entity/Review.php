<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Review
 *
 * @ORM\Table(name="reviews", indexes={@ORM\Index(name="fk_reviews_libros", columns={"libro_id"}), @ORM\Index(name="fk_reviews_users", columns={"user_id"})})
 * @ORM\Entity
 */
class Review
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
     * @var \Libro
     *
     * @ORM\ManyToOne(targetEntity="Libro")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="libro_id", referencedColumnName="id")
     * })
     */
    private $idLibro;

    /**
     * @var \Libro
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumns({
     *   @ORM\JoinColumn(name="user_id", referencedColumnName="id")
     * })
     */
    private $idUser;

    /**
     * @var string
     *
     * @ORM\Column(name="contenido", type="string", length=255, nullable=false)
     */
    private $contenido;

    /**
     * @var int
     *
     * @ORM\Column(name="score", type="integer", length=255, nullable=false)
     */
    private $score;

    /**
     * @var string
     *
     * @ORM\Column(name="titulo", type="string", length=255, nullable=false)
     */
    private $titulo;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getIdUser(): ?User
    {
        return $this->idUser;
    }

    public function setIdUser(?User $idUser): self
    {
        $this->idUser = $idUser;

        return $this;
    }

    public function getContenido(): ?string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): self
    {
        $this->contenido = $contenido;

        return $this;
    }

    public function getTitulo(): ?string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): self
    {
        $this->titulo = $titulo;

        return $this;
    }

    public function getScore(): ?int
    {
        return $this->score;
    }

    public function setScore(int $score): self
    {
        $this->score = $score;

        return $this;
    }

}