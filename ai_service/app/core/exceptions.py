
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse

class LLMGenerationError(Exception):
    pass

def setup_exception_handlers(app: FastAPI):
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        return JSONResponse(
            status_code=500,
            content={"message": f"Internal Server Error: {str(exc)}"},
        )
