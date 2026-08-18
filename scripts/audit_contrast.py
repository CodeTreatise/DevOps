#!/usr/bin/env python3
"""WCAG 2.x contrast audit for the site palette + real text/background pairs."""
import colorsys

def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgba_to_rgb(rgba, base):
    """rgba = (r,g,b,a) over base (r,g,b)."""
    r, g, b, a = rgba
    br, bg, bb = base
    return (round(r*a + br*(1-a)), round(g*a + bg*(1-a)), round(b*a + bb*(1-a)))

def lum(c):
    def f(v):
        v /= 255
        return v/12.92 if v <= 0.03928 else ((v+0.055)/1.055)**2.4
    r, g, b = [f(x) for x in c]
    return 0.2126*r + 0.7152*g + 0.0722*b

def contrast(fg, bg):
    l1, l2 = lum(fg), lum(bg)
    if l1 < l2: l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)

BASE = hex_rgb("#070a13")
BG2  = hex_rgb("#0b1020")

# composite backgrounds used across the site
bgs = {
    "bg (page)":            BASE,
    "bg-2 (toolbar)":       BG2,
    "sidebar (11,16,32,.72)": rgba_to_rgb((11,16,32,.72), BASE),
    "flyout (11,16,32,.97)":  rgba_to_rgb((11,16,32,.97), BASE),
    "panel (.035 white)":   rgba_to_rgb((255,255,255,.035), BASE),
    "panel-2 (.06)":        rgba_to_rgb((255,255,255,.06), BASE),
    "panel-hover (.075)":   rgba_to_rgb((255,255,255,.075), BASE),
    "code bg (0,0,0,.3)":   rgba_to_rgb((0,0,0,.3), BASE),
    "research body (0,0,0,.22)": rgba_to_rgb((0,0,0,.22), BASE),
    "tracker input (0,0,0,.28)": rgba_to_rgb((0,0,0,.28), BASE),
    "badge verified (.12 green)": rgba_to_rgb((61,220,151,.12), BASE),
    "badge official (.14 violet)": rgba_to_rgb((177,109,255,.14), BASE),
    "badge unverified (.16 slate)": rgba_to_rgb((100,112,143,.16), BASE),
    "badge kind (.05 white)": rgba_to_rgb((255,255,255,.05), BASE),
    "print #fff":           (255,255,255),
}

texts = {
    "--text":      hex_rgb("#eef2fb"),
    "--text-dim":  hex_rgb("#a6b2cf"),
    "--text-faint":hex_rgb("#7a87ab"),
    "--accent":    hex_rgb("#6d8dff"),
    "--accent-2":  hex_rgb("#b16dff"),
    "--cyan":      hex_rgb("#38e1e8"),
    "--green":     hex_rgb("#3ddc97"),
    "--amber":     hex_rgb("#ffc857"),
    "--red":       hex_rgb("#ff6b8a"),
    "#fff":        (255,255,255),
    "#111 (print)": (17,17,17),
}

print(f"{'fg':<14}{'bg':<26}{'ratio':>7}  verdict")
print("-" * 58)

rows = []
# every text color on the 3 primary dark surfaces
for bgname in ["bg (page)", "bg-2 (toolbar)", "sidebar (11,16,32,.72)", "flyout (11,16,32,.97)"]:
    for tn, tc in texts.items():
        rows.append((tn, bgname, contrast(tc, bgs[bgname])))
# text on panel surfaces (cards)
for bgname in ["panel (.035 white)", "panel-2 (.06)", "panel-hover (.075)"]:
    for tn, tc in texts.items():
        rows.append((tn, bgname, contrast(tc, bgs[bgname])))
# special real pairs (from CSS)
special = [
    ("--cyan", "code bg (0,0,0,.3)"),
    ("--text-dim", "research body (0,0,0,.22)"),
    ("--text-faint", "research body (0,0,0,.22)"),
    ("--text", "tracker input (0,0,0,.28)"),
    ("--green", "badge verified (.12 green)"),
    ("--accent-2", "badge official (.14 violet)"),
    ("--text-faint", "badge unverified (.16 slate)"),
    ("--text-dim", "badge kind (.05 white)"),
    ("#111 (print)", "print #fff"),
    ("--cyan", "panel-2 (.06)"),   # howto-link on card
    ("--accent", "panel (.035 white)"),  # links inside cards
]
for tn, bgname in special:
    rows.append((tn, bgname, contrast(texts[tn], bgs[bgname])))

def verdict(c, size="normal"):
    if size == "large":
        return "PASS AA" if c >= 3.0 else ("PASS AA?" if c >= 3.0 else "FAIL")
    return "PASS" if c >= 4.5 else ("3:1 only" if c >= 3.0 else "FAIL")

fails = []
for tn, bgname, c in rows:
    v = verdict(c)
    flag = ""
    if c < 4.5:
        flag = "  <-- CHECK"
        fails.append((tn, bgname, c))
    print(f"{tn:<14}{bgname:<26}{c:>7.2f}  {v}{flag}")

print("\n=== SUMMARY ===")
print(f"pairs tested: {len(rows)}")
print(f"below 4.5:1:  {len(fails)}")
for tn, bg, c in sorted(fails, key=lambda x: x[2]):
    print(f"  {tn:<14} on {bg:<26} = {c:.2f}")
