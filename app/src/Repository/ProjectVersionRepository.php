<?php

namespace App\Repository;

use App\Entity\ProjectVersion;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ProjectVersion>
 *
 * @method ProjectVersion|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectVersion|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectVersion[]    findAll()
 * @method ProjectVersion[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectVersionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectVersion::class);
    }
}
