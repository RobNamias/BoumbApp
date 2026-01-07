<?php

namespace App\Repository;

use App\Entity\SynthPreset;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SynthPreset>
 *
 * @method SynthPreset|null find($id, $lockMode = null, $lockVersion = null)
 * @method SynthPreset|null findOneBy(array $criteria, array $orderBy = null)
 * @method SynthPreset[]    findAll()
 * @method SynthPreset[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SynthPresetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SynthPreset::class);
    }
}
