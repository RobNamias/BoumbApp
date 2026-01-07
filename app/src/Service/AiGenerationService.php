<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class AiGenerationService
{
    public function __construct(
        private HttpClientInterface $client,
        #[Autowire('%env(AI_API_URL)%')] private string $aiApiUrl
    ) {
    }

    /**
     * Appelle le service Python pour générer une mélodie.
     *
     * @param array $payload Données du prompt (prompt, tempo, scale, temperature)
     * @return array La réponse JSON du service IA
     */
    public function generateMelody(array $payload): array
    {
        $response = $this->client->request('POST', $this->aiApiUrl . '/v1/melody', [
            'json' => $payload,
        ]);

        return $response->toArray();
    }
}
