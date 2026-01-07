<?php

namespace App\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryItemExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Project;
use App\Entity\User;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

final class CurrentUserExtension implements QueryCollectionExtensionInterface, QueryItemExtensionInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    public function applyToItem(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, array $identifiers, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        if (Project::class !== $resourceClass) {
            return;
        }

        $user = $this->security->getUser();

        // Si pas connecté ou Admin, on peut tout voir (Optionnel, ici on restreint même Admin pour le moment ou on laisse Admin tout voir ?)
        // Pour le MVP "Studio", même l'admin a son propre studio. Mais pour le debug c'est mieux si Admin voit tout.
        // On va dire: Si ROLE_ADMIN, on ne filtre pas.
        if (!$user instanceof User || $this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder->andWhere(sprintf('%s.owner = :current_user_id', $rootAlias));
        $queryBuilder->setParameter('current_user_id', $user->getId());
        
        // Si on veut aussi permettre de voir les projets publics :
        // $queryBuilder->orWhere(sprintf('%s.isPublic = :true', $rootAlias));
        // $queryBuilder->setParameter('true', true);
        // Mais attention au OR avec le AND existant.
        // Pour l'instant : "Un User ne voit QUE ses projets".
    }
}
