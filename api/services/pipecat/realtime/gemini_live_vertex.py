"""CallAgent subclass of pipecat's Gemini Live Vertex AI LLM service.

Diamond inheritance: combines the CallAgent engine-integration overrides from
:class:`CallAgentGeminiLiveLLMService` with the Vertex-specific tweaks from
upstream's :class:`GeminiLiveVertexLLMService` (no history config,
``NON_BLOCKING`` tools disabled, service-account credentials).

MRO::

    CallAgentGeminiLiveVertexLLMService
      -> CallAgentGeminiLiveLLMService
      -> GeminiLiveVertexLLMService
      -> GeminiLiveLLMService
      -> LLMService
      -> ...
"""

from api.services.pipecat.realtime.gemini_live import CallAgentGeminiLiveLLMService
from pipecat.services.google.gemini_live.vertex.llm import (
    GeminiLiveVertexLLMService,
)


class DograhGeminiLiveVertexLLMService(
    CallAgentGeminiLiveLLMService,
    GeminiLiveVertexLLMService,
):
    """Vertex AI variant of Gemini Live with CallAgent integration quirks."""

    pass


# Guard against MRO regressions: a future refactor that flips inheritance
# order or breaks the diamond would silently bypass the CallAgent overrides.
_mro = CallAgentGeminiLiveVertexLLMService.__mro__
assert _mro[1] is CallAgentGeminiLiveLLMService, (
    f"Expected CallAgentGeminiLiveLLMService at MRO[1], got {_mro[1]}"
)
assert _mro[2] is GeminiLiveVertexLLMService, (
    f"Expected GeminiLiveVertexLLMService at MRO[2], got {_mro[2]}"
)
del _mro
