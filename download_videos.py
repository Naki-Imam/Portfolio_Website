import urllib.request
import ssl
import os
import sys

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE
opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
urllib.request.install_opener(opener)

os.makedirs('/Users/naki/Website/assets/videos', exist_ok=True)

# Copy v6 from existing file
if os.path.exists('/Users/naki/Website/assets/videos/verticle_cfg.mp4'):
    os.system('cp /Users/naki/Website/assets/videos/verticle_cfg.mp4 /Users/naki/Website/assets/videos/v6.mp4')
    print("v6.mp4 created from verticle_cfg.mp4")

videos = {
    'v1': ('10KnokvJI_wxBZEJnJnq8joKiBxfC9xdT', 101314985),
    'v2': ('1nSSuOOaWdeYFaxV-PZ4wFCqLePHPmTfB', 91075935),
    'v3': ('1qEIOD1s1rP7uUONoArqyUQ7FsgHaju2i', 22345041),
    'v4': ('1HRZBEpZMNOsXeZKnAF2zWU9RRPopMCfL', 54490062),
    'v5': ('1DAlQLPMw_Q1bMCJmSZ4VSFaBwrwSJR1g', 76666951),
    'v7': ('1gu4Fd6op6eEZZV3q-cUnCiSyxdYdUTWv', 29888068)
}

for name, (fid, expected_size) in videos.items():
    dest_path = f'/Users/naki/Website/assets/videos/{name}.mp4'
    if os.path.exists(dest_path) and os.path.getsize(dest_path) == expected_size:
        print(f"{name}.mp4 already downloaded ({expected_size} bytes). Skipping.")
        continue

    print(f"Downloading {name}.mp4 (ID: {fid}, expected {expected_size/(1024*1024):.1f} MB)...")
    url = f'https://drive.google.com/uc?export=download&id={fid}'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    temp_path = dest_path + '.tmp'
    with urllib.request.urlopen(req) as resp, open(temp_path, 'wb') as f:
        downloaded = 0
        while True:
            chunk = resp.read(1024 * 512)
            if not chunk:
                break
            f.write(chunk)
            downloaded += len(chunk)
            # print progress occasionally
            if downloaded % (5 * 1024 * 1024) < len(chunk):
                print(f"  {name}: {downloaded/(1024*1024):.1f} MB downloaded", flush=True)
    os.rename(temp_path, dest_path)
    print(f"Finished {name}.mp4: {os.path.getsize(dest_path)} bytes", flush=True)

print("All video downloads complete!")
