<?php

namespace App\Entity;

use App\Repository\ProjectVersionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ProjectVersionRepository::class)]
#[ORM\Table(name: '`project_version`')]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(),
    ],
    normalizationContext: ['groups' => ['version:read']],
    denormalizationContext: ['groups' => ['version:create']]
)]
#[ApiFilter(SearchFilter::class, properties: ['project' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['versionNumber' => 'DESC'])]
class ProjectVersion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['version:read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'projectVersions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['version:read', 'version:create'])]
    private ?Project $project = null;

    #[ORM\Column]
    #[Assert\Positive]
    #[Groups(['version:read', 'version:create'])]
    private ?int $versionNumber = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Groups(['version:read', 'version:create'])]
    private array $data = [];

    #[ORM\Column]
    #[Groups(['version:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProject(): ?Project
    {
        return $this->project;
    }

    public function setProject(?Project $project): static
    {
        $this->project = $project;

        return $this;
    }

    public function getVersionNumber(): ?int
    {
        return $this->versionNumber;
    }

    public function setVersionNumber(int $versionNumber): static
    {
        $this->versionNumber = $versionNumber;

        return $this;
    }

    public function getData(): array
    {
        return $this->data;
    }

    public function setData(array $data): static
    {
        $this->data = $data;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
}
