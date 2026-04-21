#!/usr/bin/env python3
"""Build the W6 launch trailer MP4 from the approved W5 frame pulls."""

from pathlib import Path
import sys

try:
    import imageio.v2 as imageio
    import numpy as np
    from PIL import Image, ImageDraw, ImageFont
except ImportError as exc:
    sys.stderr.write(
        "Missing trailer packaging dependency: %s\n"
        "Run: bash ACTIVE/game/scripts/package_launch_trailer.sh\n" % exc
    )
    raise


REPO_ROOT = Path("/Users/tkevinbigham/Projects/CEHP")
W5_DELIVERY = REPO_ROOT / "ACTIVE" / "delivery" / "w5_demo"
W6_DELIVERY = REPO_ROOT / "ACTIVE" / "delivery" / "w6_launch"
TRAILER_PATH = W6_DELIVERY / "cehp_launch_trailer_final.mp4"
POSTER_PATH = W6_DELIVERY / "cehp_launch_trailer_poster.png"
RECEIPT_PATH = W5_DELIVERY / "receipts" / "rasta_receipt_thermal.png"

FPS = 24
WIDTH = 1920
HEIGHT = 1080
BACKGROUND = (246, 239, 227)
PAPER = (252, 248, 240)
INK = (28, 25, 22)
STAMP = (132, 44, 40)
FRAME_EDGE = (42, 39, 34)
LABEL_BG = (245, 236, 220)

FRAME_GROUPS = [
    {
        "label": "W1 ORIENTATION BUREAU",
        "seed": "CASE-20260429-001-BOOT-R1",
        "seconds": 5,
        "files": [
            W5_DELIVERY / "trailer_frames" / "w1_orientation" / "frame_003_030000.png",
            W5_DELIVERY / "trailer_frames" / "w1_orientation" / "frame_007_070000.png",
            W5_DELIVERY / "trailer_frames" / "w1_orientation" / "frame_016_160000.png",
            W5_DELIVERY / "trailer_frames" / "w1_orientation" / "frame_017_170000.png",
            W5_DELIVERY / "trailer_frames" / "w1_orientation" / "frame_020_200000.png",
            W5_DELIVERY / "trailer_frames" / "w1_orientation" / "frame_028_280000.png",
        ],
    },
    {
        "label": "W2 BENEFITS ATRIUM",
        "seed": "CASE-20260506-001-BEN-R1",
        "seconds": 5,
        "files": [
            W5_DELIVERY / "trailer_frames" / "w2_benefits" / "frame_003_030000.png",
            W5_DELIVERY / "trailer_frames" / "w2_benefits" / "frame_008_080000.png",
            W5_DELIVERY / "trailer_frames" / "w2_benefits" / "frame_013_130000.png",
            W5_DELIVERY / "trailer_frames" / "w2_benefits" / "frame_018_180000.png",
            W5_DELIVERY / "trailer_frames" / "w2_benefits" / "frame_023_230000.png",
            W5_DELIVERY / "trailer_frames" / "w2_benefits" / "frame_028_280000.png",
        ],
    },
    {
        "label": "W3 RASTA LOGISTICS",
        "seed": "CASE-20260504-001-GRACE-R2",
        "seconds": 8,
        "files": [
            W5_DELIVERY / "trailer_frames" / "w3_rasta" / "frame_003_030000.png",
            W5_DELIVERY / "trailer_frames" / "w3_rasta" / "frame_005_050000.png",
            W5_DELIVERY / "trailer_frames" / "w3_rasta" / "frame_010_100000.png",
            W5_DELIVERY / "trailer_frames" / "w3_rasta" / "frame_015_150000.png",
            W5_DELIVERY / "trailer_frames" / "w3_rasta" / "frame_020_200000.png",
            W5_DELIVERY / "trailer_frames" / "w3_rasta" / "frame_029_290000.png",
        ],
    },
]

FONT_CANDIDATES = [
    "/System/Library/Fonts/Menlo.ttc",
    "/System/Library/Fonts/Supplemental/Courier New.ttf",
    "/Library/Fonts/Courier New.ttf",
]


def load_font(size):
    for candidate in FONT_CANDIDATES:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


FONT_TITLE = load_font(58)
FONT_LABEL = load_font(36)
FONT_META = load_font(28)


def ensure_output():
    W6_DELIVERY.mkdir(parents=True, exist_ok=True)


def centered_box(width, height):
    x0 = int((WIDTH - width) / 2)
    y0 = int((HEIGHT - height) / 2)
    return x0, y0, x0 + width, y0 + height


def base_canvas():
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)
    for index in range(0, HEIGHT, 32):
        color = (BACKGROUND[0] - 2, BACKGROUND[1] - 2, BACKGROUND[2] - 1)
        draw.line([(0, index), (WIDTH, index)], fill=color, width=1)
    for index in range(12):
        x = 140 + (index * 138)
        y = 96 + ((index % 4) * 212)
        draw.rectangle([x, y, x + 16, y + 16], outline=(235, 224, 207), width=1)
    return image


def draw_stamp(draw, text, x, y):
    bbox = draw.textbbox((x, y), text, font=FONT_LABEL)
    pad_x = 22
    pad_y = 12
    rect = [
        bbox[0] - pad_x,
        bbox[1] - pad_y,
        bbox[2] + pad_x,
        bbox[3] + pad_y,
    ]
    draw.rounded_rectangle(rect, radius=14, outline=STAMP, width=4)
    draw.text((x, y), text, fill=STAMP, font=FONT_LABEL)


def draw_meta(draw, label, seed):
    draw.text((142, 112), label, fill=INK, font=FONT_TITLE)
    draw.text((142, 170), seed, fill=INK, font=FONT_META)


def compose_opener():
    image = base_canvas()
    draw = ImageDraw.Draw(image)
    draw.text((142, 128), "CEHP LAUNCH CHECK", fill=INK, font=FONT_TITLE)
    draw.text((142, 206), "SEEDED RUNS FILED 2026-04-21", fill=INK, font=FONT_META)
    draw_stamp(draw, "DOCUMENTARY CUT", 1430, 124)
    seeds = [
        "CASE-20260429-001-BOOT-R1",
        "CASE-20260506-001-BEN-R1",
        "CASE-20260504-001-GRACE-R2",
    ]
    y = 360
    for seed in seeds:
        draw.rounded_rectangle([220, y - 18, 1700, y + 50], radius=12, fill=PAPER, outline=(226, 216, 198), width=2)
        draw.text((260, y), seed, fill=INK, font=FONT_LABEL)
        y += 118
    draw.text((220, 802), "NO MUSIC. NO LOGO STING. RECEIPT LAST.", fill=STAMP, font=FONT_META)
    draw.text((220, 860), "THERMAL MODE IS PRESENTATION ONLY.", fill=INK, font=FONT_META)
    return image


def place_game_frame(source_path, label, seed):
    source = Image.open(source_path).convert("RGB")
    source = source.resize((1024, 896), Image.Resampling.NEAREST)
    image = base_canvas()
    draw = ImageDraw.Draw(image)
    frame_box = centered_box(1088, 960)
    draw.rectangle(frame_box, fill=PAPER, outline=FRAME_EDGE, width=6)
    image.paste(source, (frame_box[0] + 32, frame_box[1] + 32))
    draw_meta(draw, label, seed)
    draw_stamp(draw, "SEEDED FOOTAGE", 1438, 124)
    draw.rounded_rectangle([142, 956, 1778, 1008], radius=10, fill=LABEL_BG, outline=(226, 216, 198), width=2)
    draw.text((170, 968), "Quiet observation. Hard cuts. The receipt does the work.", fill=INK, font=FONT_META)
    return image


def place_receipt():
    source = Image.open(RECEIPT_PATH).convert("RGB")
    source.thumbnail((760, 940), Image.Resampling.LANCZOS)
    image = base_canvas()
    draw = ImageDraw.Draw(image)
    frame_box = centered_box(source.width + 64, source.height + 64)
    draw.rectangle(frame_box, fill=PAPER, outline=FRAME_EDGE, width=6)
    image.paste(source, (frame_box[0] + 32, frame_box[1] + 32))
    draw_meta(draw, "THERMAL RECEIPT", "CASE-20260504-001-GRACE-R2")
    draw_stamp(draw, "FINAL FRAME", 1516, 124)
    draw.rounded_rectangle([142, 956, 1778, 1008], radius=10, fill=LABEL_BG, outline=(226, 216, 198), width=2)
    draw.text((170, 968), "THE FILE UNDERSTOOD. PATIENCE MADE SPACE FOR YOU.", fill=INK, font=FONT_META)
    return image


def expand(images, seconds):
    total_frames = seconds * FPS
    count = len(images)
    base = total_frames // count
    extra = total_frames % count
    out = []
    for index, image in enumerate(images):
        repeats = base + (1 if index < extra else 0)
        out.extend([image] * repeats)
    return out


def build_frames():
    frames = []
    frames.extend([compose_opener()] * (2 * FPS))
    for group in FRAME_GROUPS:
        stills = [place_game_frame(path, group["label"], group["seed"]) for path in group["files"]]
        frames.extend(expand(stills, group["seconds"]))
    frames.extend([place_receipt()] * (8 * FPS))
    return frames


def write_video(frames):
    writer = imageio.get_writer(
        str(TRAILER_PATH),
        fps=FPS,
        codec="libx264",
        macro_block_size=None,
        pixelformat="yuv420p",
        bitrate="12000k",
    )
    try:
        for frame in frames:
            writer.append_data(np.asarray(frame))
    finally:
        writer.close()


def write_poster(frames):
    frames[-1].save(POSTER_PATH)


def main():
    ensure_output()
    frames = build_frames()
    write_video(frames)
    write_poster(frames)
    print("Packaged launch trailer -> %s" % TRAILER_PATH)
    print("Poster frame -> %s" % POSTER_PATH)
    print("Frames: %s at %sfps" % (len(frames), FPS))


if __name__ == "__main__":
    main()
