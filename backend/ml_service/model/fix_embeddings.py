import os
import io
import pickle
import torch

MODEL_FOLDER = os.path.dirname(__file__)
src_path = os.path.join(MODEL_FOLDER, "embeddings.pkl")
dst_path = os.path.join(MODEL_FOLDER, "embeddings_cpu.pt")

class CPU_Unpickler(pickle.Unpickler):
    def find_class(self, module, name):
        if module == "torch.storage" and name == "_load_from_bytes":
            return lambda b: torch.load(io.BytesIO(b), map_location="cpu")
        return super().find_class(module, name)

print("🔄 Forcing CPU load bypassing CUDA...")

with open(src_path, "rb") as f:
    data = CPU_Unpickler(f).load()

if isinstance(data, torch.Tensor):
    tensor = data.cpu()
else:
    tensor = torch.tensor(data).cpu()

torch.save(tensor, dst_path)

print("✔ Successfully converted to CPU-safe:", dst_path)
print("📌 Tensor shape:", tensor.shape)
