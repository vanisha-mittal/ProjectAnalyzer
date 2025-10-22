from datasets import load_dataset
import os
from huggingface_hub import login
from dotenv import load_dotenv
load_dotenv()
print(os.getenv("HF_TOKEN"))

# --- Auto-authenticate with Hugging Face ---
token = os.getenv("HF_TOKEN")

if token:
    try:
        login(token=token)
        print("Authenticated with Hugging Face using HF_TOKEN")
    except Exception as e:
        print(f" Failed to authenticate automatically: {e}")
else:
    print(" No HF_TOKEN found in environment. Please run 'huggingface-cli login' or set HF_TOKEN in .env")


def load_codesearchnet_online(language="python", sample_size=500):
    print(f" Loading '{language}' samples online from The Stack (smol)...")

    # 'bigcode/the-stack-smol' supports per-language splits directly
    dataset_name = "bigcode/the-stack-smol"
    split_name = f"data/{language}"

    try:
        dataset = load_dataset(dataset_name, split=split_name, streaming=True)
    except Exception as e:
        print(f" Failed to load language-specific split '{split_name}'. Defaulting to mixed set.")
        dataset = load_dataset(dataset_name, split="train", streaming=True)

    samples = []
    for i, row in enumerate(dataset):
        code = row.get("content") or row.get("code") or ""
        if code.strip():
            samples.append(code)
        if len(samples) >= sample_size:
            break

    print(f" Loaded {len(samples)} streamed {language} samples online.")
    return samples


if __name__ == "__main__":
    data = load_codesearchnet_online(language="python", sample_size=300)
    print(f"Example snippet:\n{data[0][:300]}...\nTotal samples: {len(data)}")
