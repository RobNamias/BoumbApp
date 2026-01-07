<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\State\ProjectProcessor;
use App\Repository\ProjectRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ProjectRepository::class)]
#[ORM\Table(name: '`project`')]
#[ApiResource(
    operations: [
        new Get(security: Project::SECURITY_USER_ONLY),
        new GetCollection(security: Project::SECURITY_USER_ONLY),
        new Post(
            security: Project::SECURITY_USER_ONLY,
            processor: ProjectProcessor::class
        )
    ],
    normalizationContext: ['groups' => ['project:read']],
    denormalizationContext: ['groups' => ['project:write']]
)]
class Project
{
    public const SECURITY_USER_ONLY = "is_granted('ROLE_USER')";
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    #[Assert\Length(max: 100)]
    #[Groups(['project:read', 'project:write'])]
    private ?string $name = null;

    #[ORM\Column]
    #[Groups(['project:read', 'project:write'])]
    private bool $isPublic = false;

    #[ORM\ManyToOne(inversedBy: 'projects')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['project:read'])]
    private ?User $owner = null;

    #[ORM\OneToMany(mappedBy: 'project', targetEntity: ProjectVersion::class, orphanRemoval: true)]
    private $projectVersions;

    #[ORM\Column]
    #[Groups(['project:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups(['project:read'])]
    private ?\DateTimeInterface $updatedAt = null;

    public function __construct()
    {
        $this->projectVersions = new \Doctrine\Common\Collections\ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    /**
     * @return \Doctrine\Common\Collections\Collection<int, ProjectVersion>
     */
    public function getProjectVersions(): \Doctrine\Common\Collections\Collection
    {
        return $this->projectVersions;
    }

    public function addProjectVersion(ProjectVersion $projectVersion): static
    {
        if (!$this->projectVersions->contains($projectVersion)) {
            $this->projectVersions->add($projectVersion);
            $projectVersion->setProject($this);
        }

        return $this;
    }

    public function removeProjectVersion(ProjectVersion $projectVersion): static
    {
        if ($this->projectVersions->removeElement($projectVersion) && $projectVersion->getProject() === $this) {
            $projectVersion->setProject(null);
        }

        return $this;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function isPublic(): bool
    {
        return $this->isPublic;
    }

    public function setPublic(bool $isPublic): static
    {
        $this->isPublic = $isPublic;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

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

    public function getUpdatedAt(): ?\DateTimeInterface
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeInterface $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
}
