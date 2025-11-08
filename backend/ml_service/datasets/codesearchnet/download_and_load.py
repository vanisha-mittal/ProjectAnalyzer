import os
import zipfile
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()  # load .env first

def authenticate_kaggle():
    """Authenticate Kaggle API using credentials from .env only."""
    import os
    from dotenv import load_dotenv

    load_dotenv()  # make sure .env is loaded

    kaggle_user = os.getenv("KAGGLE_USERNAME")
    kaggle_key = os.getenv("KAGGLE_KEY")

    if not kaggle_user or not kaggle_key:
        raise ValueError("Kaggle credentials not found in .env") 

    # Set environment variables explicitly
    os.environ["KAGGLE_USERNAME"] = kaggle_user
    os.environ["KAGGLE_KEY"] = kaggle_key

    # Import KaggleApi after env variables are set
    from kaggle.api.kaggle_api_extended import KaggleApi
    api = KaggleApi()
    api.authenticate()
    print("✅ Authenticated with Kaggle successfully.")
    return api




def download_kaggle_dataset(dataset_name, download_path="./datasets", unzip=True):
    """
    Download a Kaggle dataset programmatically.
    Example: dataset_name = 'saurabhshahane/code-summarization-codesearchnet'
    """
    os.makedirs(download_path, exist_ok=True)
    api = authenticate_kaggle()

    print(f"⬇️ Downloading dataset: {dataset_name} ...")
    api.dataset_download_files(dataset_name, path=download_path, unzip=False)
    zip_path = os.path.join(download_path, f"{dataset_name.split('/')[-1]}.zip")

    if unzip:
        print("📦 Extracting files...")
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(download_path)
        os.remove(zip_path)
        print("✅ Extraction complete.")

    print(f"✅ Dataset available at: {os.path.abspath(download_path)}")
    return download_path


def load_code_samples(local_path="./datasets", language="python", sample_size=300):
    """
    Load code samples from downloaded Kaggle dataset.
    Filters by file extension (e.g. .py, .java, etc.)
    """
    samples = []
    ext = {
        "python": ".py",
        "java": ".java",
        "cpp": ".cpp",
        "javascript": ".js"
    }.get(language, ".py")

    print(f"📂 Loading {language} code files from {local_path}...")
    for root, _, files in os.walk(local_path):
        for file in files:
            if file.endswith(ext):
                with open(os.path.join(root, file), "r", encoding="utf-8", errors="ignore") as f:
                    code = f.read()
                    if code.strip():
                        samples.append(code)
                        if len(samples) >= sample_size:
                            print(f"✅ Loaded {len(samples)} {language} samples.")
                            return samples
    print(f"✅ Loaded {len(samples)} total samples.")
    return samples


if __name__ == "__main__":
    dataset_name = "saurabhshahane/code-summarization-codesearchnet"
    data_path = download_kaggle_dataset(dataset_name, download_path="./datasets/codesearchnet")
    samples = load_code_samples(local_path=data_path, language="python", sample_size=300)

    if samples:
        print(f"\nExample code snippet:\n{'-'*40}\n{samples[0][:300]}\n...")
