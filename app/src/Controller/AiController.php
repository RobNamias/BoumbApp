<?php

namespace App\Controller;

use App\Service\AiGenerationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class AiController extends AbstractController
{
    public function __construct(
        private AiGenerationService $aiService
    ) {
    }

    #[Route('/api/ai/generate', name: 'api_ai_generate', methods: ['POST'])]
    public function generate(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $prompt = $data['prompt'] ?? null;

        if (!$prompt) {
            return $this->json(['error' => 'Prompt is required'], 400);
        }

        try {
            // Nous passons tout le payload (prompt, tempo, etc.) au service
            $result = $this->aiService->generateMelody($data);
            return $this->json($result);
        } catch (\Exception $e) {
            return $this->json(['error' => 'AI Generation failed: ' . $e->getMessage()], 500);
        }
    }
}
