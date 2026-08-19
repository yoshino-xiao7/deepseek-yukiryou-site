#!/usr/bin/env python3
"""生成 OG 封面图（1200x630），纯 Pillow 绘制，结果确定、可复现。"""
import os
import sys

sys.path.insert(0, os.environ.get("PYTHONPATH", ""))

from PIL import Image, ImageDraw, ImageFilter, ImageFont

OUT = os.environ.get("OG_OUT", "public/og-cover.png")
ICON_SRC = os.environ.get("OG_ICON", ".assets-tmp/icon-src.png")
W, H = 1200, 630

BG = (5, 7, 11)
TEXT = (242, 245, 250)
MUTED = (154, 164, 184)
FAINT = (107, 114, 128)
ACCENT = (77, 107, 254)
ACCENT_LIGHT = (107, 132, 255)


def font(size, bold=False):
    # Hiragino Sans GB：index 0 = W3（常规），index 1 = W6（粗体）
    return ImageFont.truetype("/System/Library/Fonts/Hiragino Sans GB.ttc", size, index=1 if bold else 0)


def main():
    img = Image.new("RGB", (W, H), BG)
    draw = ImageDraw.Draw(img)

    # 顶部蓝色辉光
    glow = Image.new("RGB", (W, H), (0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-300, -500, W + 300, 320), fill=(31, 43, 102))
    glow = glow.filter(ImageFilter.GaussianBlur(160))
    img = Image.blend(img, glow, 0.75)

    # 网格线（先画在带透明通道的图上再合成，避免把 RGB 图刷白）
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd2 = ImageDraw.Draw(grid)
    for x in range(0, W, 56):
        gd2.line([(x, 0), (x, H)], fill=(255, 255, 255, 12), width=1)
    for y in range(0, H, 56):
        gd2.line([(0, y), (W, y)], fill=(255, 255, 255, 12), width=1)
    img.paste(grid, (0, 0), grid)
    draw = ImageDraw.Draw(img)

    # 图标
    icon = Image.open(ICON_SRC).convert("RGBA").resize((96, 96), Image.LANCZOS)
    mask = Image.new("L", (96, 96), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, 95, 95], radius=22, fill=255)
    img.paste(icon, (80, 64), mask)

    # 品牌
    draw.text((204, 72), "DeepSeek YukiRyou", font=font(34, True), fill=TEXT)
    draw.text((204, 118), "DeepSeek Harness Desktop for macOS", font=font(19), fill=MUTED)

    # 主标题
    draw.text((80, 236), "让 DeepSeek Harness", font=font(44, True), fill=TEXT)
    draw.text((80, 298), "真正像一个 Mac 应用", font=font(44, True), fill=ACCENT_LIGHT)
    draw.text((80, 370), "为 Apple Silicon 打造的独立桌面工作台 · 打开即用", font=font(21), fill=MUTED)

    # 按钮
    def pill(x, w, h, r, fill, outline=None):
        if outline:
            draw.rounded_rectangle([x, 460, x + w, 460 + h], radius=r, fill=fill, outline=outline, width=2)
        else:
            draw.rounded_rectangle([x, 460, x + w, 460 + h], radius=r, fill=fill)

    pill(80, 232, 58, 29, ACCENT)
    pill(330, 232, 58, 29, (0, 0, 0, 0), outline=(255, 255, 255, 64))

    btn1 = "下载应用"
    b1w = draw.textlength(btn1, font=font(22, True))
    draw.text((80 + (232 - b1w) / 2, 460 + 15), btn1, font=font(22, True), fill=(255, 255, 255))

    btn2 = "在 GitHub 上查看"
    b2w = draw.textlength(btn2, font=font(22, True))
    draw.text((330 + (232 - b2w) / 2, 460 + 15), btn2, font=font(22, True), fill=(232, 236, 244))

    # 页脚说明
    draw.text(
        (80, 566),
        "社区开源项目，非 DeepSeek 官方产品 · macOS 14+ · Apple Silicon · MIT License",
        font=font(16),
        fill=FAINT,
    )

    os.makedirs(os.path.dirname(OUT) or ".", exist_ok=True)
    img.save(OUT, "PNG")
    print("og-cover.png saved:", OUT)


if __name__ == "__main__":
    main()
