import os
import shutil

SRC_DIR = 'src'
DIST_DIR = 'dist'
ENV_FILE = '.env'

def build():
    # 1. Clean and Copy
    if os.path.exists(DIST_DIR):
        shutil.rmtree(DIST_DIR)
    shutil.copytree(SRC_DIR, DIST_DIR)

    # 2. Load .env variables
    env_vars = {}
    with open(ENV_FILE, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, val = line.split('=', 1)
                # Clean up quotes and whitespace
                env_vars[key.strip()] = val.strip().strip("'").strip('"')

    # 3. Search and Replace
    for root, dirs, files in os.walk(DIST_DIR):
        for file in files:
            file_path = os.path.join(root, file)
            
            # Read the file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            
            for key, value in env_vars.items():
                # This replaces the KEY with the VALUE exactly as written
                if key in content:
                    print(f"✅ Found {key} in {file} -> Replacing with {value}")
                    content = content.replace(key, value)

            # Only save if we actually changed something
            if content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

    print("\nDone! Check the 'dist' folder.")

if __name__ == "__main__":
    build()