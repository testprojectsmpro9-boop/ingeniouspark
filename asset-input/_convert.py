"""One-shot PNG -> JPG conversion script for Innovation Hub assets.
Run once; safe to delete after.
"""
from PIL import Image
from pathlib import Path
import shutil
import sys

SRC = Path(r"D:\python_projects\nmfxifia\asset-input")
DST = Path(r"D:\python_projects\nmfxifia\public\innovation-hub")

MAPPING = {
    "1.png":  DST / "hero-palace-duotone.jpg",
    "2.png":  DST / "heritage" / "1.jpg",
    "4.png":  DST / "heritage" / "2.jpg",
    "3.png":  DST / "heritage" / "3.jpg",
    "6.png":  DST / "wodeyar-vision-legacy.jpg",
    "5.png":  DST / "sir-mv-engineering-legacy.jpg",
    "7.png":  DST / "audience" / "students.jpg",
    "8.png":  DST / "audience" / "farmers.jpg",
    "11.png": DST / "audience" / "makers.jpg",
    "12.png": DST / "audience" / "researchers.jpg",
    "13.png": DST / "audience" / "startups.jpg",
    "14.png": DST / "audience" / "teachers.jpg",
    "15.png": DST / "audience" / "grassroots.jpg",
    "16.png": DST / "audience" / "ngos.jpg",
    "9.png":  DST / "support" / "mentorship.jpg",
    "17.png": DST / "support" / "prototype.jpg",
    "18.png": DST / "support" / "review.jpg",
    "19.png": DST / "support" / "ip-guidance.jpg",
    "10.png": DST / "support" / "exhibition.jpg",
    "20.png": DST / "support" / "collaboration.jpg",
}

VIDEO_MAPPING = {
    "hero-legacy-loop.mp4":        DST / "video" / "hero-legacy-loop.mp4",
    "support-showcase-loop.mp4":   DST / "video" / "support-showcase-loop.mp4",
    "local-to-global-loop.mp4":    DST / "video" / "local-to-global-loop.mp4",
}

missing = []
converted = 0
for png_name, jpg_path in MAPPING.items():
    src = SRC / png_name
    if not src.exists():
        missing.append(str(src))
        continue
    jpg_path.parent.mkdir(parents=True, exist_ok=True)
    img = Image.open(src)
    if img.mode in ("RGBA", "LA", "P"):
        bg = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "P":
            img = img.convert("RGBA")
        bg.paste(img, mask=img.split()[-1] if img.mode in ("RGBA", "LA") else None)
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")
    img.save(jpg_path, "JPEG", quality=90, optimize=True, progressive=True)
    converted += 1
    print(f"  {png_name:>8s}  ->  {jpg_path.relative_to(DST.parent.parent)}")

print(f"\nImages converted: {converted}/{len(MAPPING)}")
if missing:
    print("MISSING PNGs:")
    for m in missing:
        print(f"  {m}")

videos_copied = 0
for vname, vdst in VIDEO_MAPPING.items():
    vsrc = SRC / vname
    if not vsrc.exists():
        print(f"MISSING video: {vsrc}")
        continue
    vdst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(vsrc, vdst)
    videos_copied += 1
    print(f"  video  {vname:>30s}  ->  {vdst.relative_to(DST.parent.parent)}")

print(f"\nVideos copied: {videos_copied}/{len(VIDEO_MAPPING)}")
sys.exit(0 if not missing else 1)
