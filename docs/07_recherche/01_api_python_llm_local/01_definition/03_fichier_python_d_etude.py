from transformers import AutoTokenizer, AutoModelForCausalLM
import torch, json, logging, re, gc, os
from logging.handlers import RotatingFileHandler


prompt="""si je te dis écrit moi une mélodie en gamme pentatonique mineur à partir d'un A5 """



model_name = "mistralai/Mistral-Small-7B"

tokenizer = AutoTokenizer.from_pretrained(model_name)
if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
device_map="auto"
model = AutoModelForCausalLM.from_pretrained(
    model_name,
    device_map=device_map,
    load_in_4bit=load_in_4bit,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True
)
model.config.use_cache = True
device = next(model.parameters()).device
tokenizer.padding_side = "left"

def _generate_single(prompt, max_new_tokens=256):
        try:
            inputs = tokenizer(prompt, return_tensors="pt", truncation=True, max_length=1024).to(device)
            with torch.inference_mode():
                outputs = model.generate(
                    **inputs,
                    max_new_tokens=max_new_tokens,
                    do_sample=False,
                    pad_token_id=tokenizer.pad_token_id,
                    eos_token_id=tokenizer.eos_token_id,
                    use_cache=True
                )
            text = tokenizer.decode(outputs[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
            return text

        except torch.cuda.OutOfMemoryError:
            torch.cuda.empty_cache(); gc.collect()
            return '{"factualite": {"type":"error","pertinence":0.0,"details":{"raw":"OOM"}}}'


raw = _generate_single(prompt)

print(raw)