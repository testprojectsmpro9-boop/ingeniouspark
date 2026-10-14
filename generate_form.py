#!/usr/bin/env python3
"""
NMF × IFIA Innovation Hub — Offline Idea Submission Form  v2
Redesigned: letter-badge section headers, K12/guardian subsection, enlarged writing
boxes, expanded Office Use Only, balanced 4-page layout.
Run:  python generate_form.py
Out:  public/offline-form.pdf
"""
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas as rc
from reportlab.lib.colors import HexColor, white

# ── Geometry ───────────────────────────────────────────────────────────────
W, H  = A4
MX    = 14 * mm          # horizontal margin
MY    = 13 * mm          # vertical margin
CW    = W - 2 * MX       # content width ≈ 483 pt / 170 mm
TOP   = H - MY           # y at top of first-page content

# ── Colour palette ─────────────────────────────────────────────────────────
EMR   = HexColor("#059669")   # section header main
EMR_D = HexColor("#064e3b")   # top bar / accents / dark emerald
EMR_M = HexColor("#047857")   # section badge bg
EMR_L = HexColor("#ecfdf5")   # note box bg
SL9   = HexColor("#111827")
SL7   = HexColor("#374151")
SL6   = HexColor("#4b5563")
SL5   = HexColor("#6b7280")
SL4   = HexColor("#9ca3af")
SL3   = HexColor("#d1d5db")
SL2   = HexColor("#e5e7eb")
SL1   = HexColor("#f9fafb")
SL0   = HexColor("#f3f4f6")   # K12 box background
LINE  = HexColor("#d1d5db")
WL    = HexColor("#e8e8e8")   # writing guide lines inside text boxes

# ── Layout constants ───────────────────────────────────────────────────────
FH    = 11 * mm    # field row height
CBH   = 8.0 * mm   # checkbox row height
BH    = 8.5 * mm   # section header bar height
BGAP  = 3.5 * mm   # gap after section bar


# ══════════════════════════════════════════════════════════════════════════
class FormPDF:

    def __init__(self, path):
        self.c    = rc.Canvas(path, pagesize=A4)
        self.c.setTitle("NMF × IFIA Innovation Hub — Offline Idea Submission Form")
        self.c.setAuthor("NMF × IFIA Innovation Hub")
        self.c.setSubject("Offline Idea Submission Form v2")
        self.page = 1
        self.y    = TOP
        self._footer()

    # ── Page management ──────────────────────────────────────────────────

    def _bottom(self):
        """Lowest usable y on current page."""
        return MY + 10 * mm

    def _space(self):
        return self.y - self._bottom()

    def _np(self, needed):
        """Force a new page if `needed` mm won't fit."""
        if self._space() < needed:
            self.c.showPage()
            self.page += 1
            self.y = TOP
            self._footer()
            self._cont_header()

    def _force_np(self):
        """Unconditional new page."""
        self.c.showPage()
        self.page += 1
        self.y = TOP
        self._footer()
        self._cont_header()

    def _footer(self):
        c = self.c
        c.setStrokeColor(SL3)
        c.setLineWidth(0.5)
        c.line(MX, MY - 3 * mm, W - MX, MY - 3 * mm)
        c.setFont("Helvetica", 6.5)
        c.setFillColor(SL5)
        c.drawString(MX, MY - 7 * mm, "NMF × IFIA Innovation Hub  ·  Mysuru, Karnataka, India")
        c.drawCentredString(W / 2, MY - 7 * mm, "nmfinventa.ourtestzone.in")
        c.drawRightString(W - MX, MY - 7 * mm,
                          f"Offline Idea Submission Form  ·  Page {self.page} of 4")

    def _cont_header(self):
        """Slim branded continuation stripe on pages 2–4."""
        c = self.c
        c.setFillColor(EMR_D)
        c.rect(MX, self.y - 6 * mm, CW, 6 * mm, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 7.5)
        c.drawString(MX + 3 * mm, self.y - 4.2 * mm,
                     "NMF × IFIA INNOVATION HUB  ·  OFFLINE IDEA SUBMISSION FORM")
        c.drawRightString(W - MX - 3 * mm, self.y - 4.2 * mm, f"Page {self.page}")
        self.y -= 6 * mm + 4 * mm

    def save(self):
        self.c.save()

    # ── Section header (letter-badge design) ─────────────────────────────

    def sec(self, letter, title):
        self._np(BH + 14 * mm)
        c = self.c
        badge_w = 11 * mm
        # Badge (darker left)
        c.setFillColor(EMR_D)
        c.roundRect(MX, self.y - BH, badge_w, BH, 2, fill=1, stroke=0)
        # Main bar
        c.setFillColor(EMR_M)
        c.rect(MX + badge_w - 1, self.y - BH, CW - badge_w + 1, BH, fill=1, stroke=0)
        # Letter centred in badge
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(MX + badge_w / 2, self.y - BH + 2.0 * mm, letter)
        # Title
        c.setFont("Helvetica-Bold", 9.5)
        c.drawString(MX + badge_w + 3.5 * mm, self.y - BH + 2.0 * mm, title.upper())
        self.y -= BH + BGAP

    # ── Field helpers ─────────────────────────────────────────────────────

    def _df(self, x, y, w, label):
        """Draw one labelled underline field."""
        c = self.c
        c.setFont("Helvetica", 7.5)
        c.setFillColor(SL5)
        c.drawString(x, y + 2 * mm, label)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.8)
        c.line(x, y - 4.8 * mm, x + w, y - 4.8 * mm)

    def frow(self, *labels, xoff=None, avail=None):
        """N equal-width fields on one row."""
        x0  = xoff if xoff is not None else MX
        aw  = avail if avail is not None else CW
        n   = len(labels)
        gap = 4.5 * mm
        fw  = (aw - (n - 1) * gap) / n
        self._np(FH)
        for i, lbl in enumerate(labels):
            self._df(x0 + i * (fw + gap), self.y, fw, lbl)
        self.y -= FH

    def ffull(self, label, xoff=None, avail=None):
        x0 = xoff if xoff is not None else MX
        aw = avail if avail is not None else CW
        self._np(FH)
        self._df(x0, self.y, aw, label)
        self.y -= FH

    # ── Checkbox grid ─────────────────────────────────────────────────────

    def cbgrid(self, items, cols=3, xoff=None, avail=None):
        items = [x for x in items if x.strip()]
        x0    = xoff if xoff is not None else MX
        aw    = avail if avail is not None else CW
        bx    = 3.8 * mm
        cw    = aw / cols
        rows  = (len(items) + cols - 1) // cols
        h     = rows * CBH + 3 * mm
        self._np(h)
        c = self.c
        for i, item in enumerate(items):
            col = i % cols
            row = i // cols
            cx  = x0 + col * cw + 0.5
            cy  = self.y - row * CBH
            c.setStrokeColor(SL7)
            c.setLineWidth(0.8)
            c.rect(cx, cy - 2.2, bx, bx, fill=0, stroke=1)
            c.setFont("Helvetica", 8.3)
            c.setFillColor(SL9)
            c.drawString(cx + bx + 1.5 * mm, cy + 0.5 * mm, item)
        self.y -= h

    # ── Text box (labelled writable area) ─────────────────────────────────

    def tbox(self, label, h_mm, hint=""):
        h       = h_mm * mm
        lh      = 9 * mm if hint else 6 * mm
        self._np(h + lh + 2 * mm)
        c = self.c
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(SL7)
        c.drawString(MX, self.y + 1.5 * mm, label)
        if hint:
            c.setFont("Helvetica-Oblique", 7.2)
            c.setFillColor(SL4)
            c.drawString(MX, self.y - 3.5 * mm, hint)
        box_top = self.y - lh + 2 * mm
        c.setFillColor(SL1)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.8)
        c.rect(MX, box_top - h, CW, h, fill=1, stroke=1)
        # writing guide lines
        ls = 7.8 * mm
        n  = int(h / ls) - 1
        c.setStrokeColor(WL)
        c.setLineWidth(0.3)
        for i in range(1, n + 1):
            c.line(MX + 3, box_top - i * ls, MX + CW - 3, box_top - i * ls)
        self.y = box_top - h - 5 * mm

    # ── Note / info box ───────────────────────────────────────────────────

    def note_box(self, lines):
        h = len(lines) * 6 * mm + 6 * mm
        self._np(h + 3 * mm)
        c = self.c
        c.setFillColor(EMR_L)
        c.setStrokeColor(EMR)
        c.setLineWidth(1.2)
        c.roundRect(MX, self.y - h, CW, h, 3, fill=1, stroke=1)
        # left accent stripe
        c.setFillColor(EMR_M)
        c.roundRect(MX, self.y - h, 3.5, h, 1, fill=1, stroke=0)
        ty = self.y - 4.5 * mm
        for ln in lines:
            bold = ln.startswith("!")
            txt  = ln[1:] if bold else ln
            c.setFont("Helvetica-Bold" if bold else "Helvetica", 8.3)
            c.setFillColor(EMR_D)
            c.drawString(MX + 6 * mm, ty, txt)
            ty -= 6 * mm
        self.y -= h + 4 * mm

    # ── K12 / guardian subsection ─────────────────────────────────────────

    def k12_box(self):
        bh = 52 * mm
        self._np(bh + 4 * mm)
        c  = self.c
        y0 = self.y
        # Outer box with shaded bg
        c.setFillColor(SL0)
        c.setStrokeColor(SL3)
        c.setLineWidth(0.9)
        c.roundRect(MX, y0 - bh, CW, bh, 2, fill=1, stroke=1)
        # Inner header stripe
        c.setFillColor(SL2)
        c.roundRect(MX, y0 - 8 * mm, CW, 8 * mm, 2, fill=1, stroke=0)
        c.setFont("Helvetica-Bold", 8)
        c.setFillColor(SL7)
        c.drawString(MX + 3 * mm, y0 - 5.5 * mm,
            "FOR K-12 / SCHOOL APPLICANTS AND MINORS (UNDER 18)  —  COMPLETE IF APPLICABLE")
        # Sub-note
        c.setFont("Helvetica-Oblique", 7.3)
        c.setFillColor(SL5)
        c.drawString(MX + 3 * mm, y0 - 12.5 * mm,
            "Parent or guardian must countersign. All fields below are required for minor applicants.")
        # Inner fields (inset by 3mm)
        pad    = 3 * mm
        inner  = CW - 2 * pad
        half   = (inner - 4.5 * mm) / 2
        iy     = y0 - 17 * mm
        self._df(MX + pad, iy, half, "Parent / Guardian Full Name")
        self._df(MX + pad + half + 4.5 * mm, iy, half, "Relationship to Applicant")
        iy -= FH
        self._df(MX + pad, iy, half, "Parent / Guardian Phone Number")
        self._df(MX + pad + half + 4.5 * mm, iy, half, "Parent / Guardian Email  (optional)")
        iy -= FH
        sig_w = inner * 0.55
        self._df(MX + pad, iy, sig_w, "Parent / Guardian Signature")
        self._df(MX + pad + sig_w + 4.5 * mm, iy,
                 inner - sig_w - 4.5 * mm, "Date  (DD / MM / YYYY)")
        self.y -= bh + 4 * mm

    # ── Declaration box (multi-paragraph) ────────────────────────────────

    def decl_box(self, paragraphs):
        """paragraphs: list of (bold: bool, text: str)"""
        c   = self.c
        fs  = 8
        ls  = 5 * mm
        mw  = CW - 9 * mm
        all_lines = []
        for bold, text in paragraphs:
            fn    = "Helvetica-Bold" if bold else "Helvetica"
            words = text.split()
            line  = ""
            for w in words:
                t = (line + " " + w).strip()
                if c.stringWidth(t, fn, fs) <= mw:
                    line = t
                else:
                    all_lines.append((bold, line))
                    line = w
            if line:
                all_lines.append((bold, line))
            all_lines.append((False, ""))   # paragraph spacer
        # remove trailing blank
        while all_lines and not all_lines[-1][1]:
            all_lines.pop()
        h = len(all_lines) * ls + 8 * mm
        self._np(h + 5 * mm)
        c.setFillColor(SL1)
        c.setStrokeColor(LINE)
        c.setLineWidth(0.8)
        c.rect(MX, self.y - h, CW, h, fill=1, stroke=1)
        c.setFillColor(EMR_M)
        c.rect(MX, self.y - h, 3, h, fill=1, stroke=0)
        ty = self.y - 5.5 * mm
        for bold, ln in all_lines:
            if ln:
                c.setFont("Helvetica-Bold" if bold else "Helvetica", fs)
                c.setFillColor(SL7)
                c.drawString(MX + 6 * mm, ty, ln)
            ty -= ls
        self.y -= h + 5 * mm

    # ── Signature row ─────────────────────────────────────────────────────

    def sig_row(self, labels):
        n   = len(labels)
        gap = 5 * mm
        fw  = (CW - (n - 1) * gap) / n
        self._np(20 * mm)
        c = self.c
        for i, lbl in enumerate(labels):
            x = MX + i * (fw + gap)
            c.setFont("Helvetica", 7.5)
            c.setFillColor(SL5)
            c.drawString(x, self.y + 1.5 * mm, lbl)
            c.setStrokeColor(LINE)
            c.setLineWidth(0.8)
            c.line(x, self.y - 12 * mm, x + fw, self.y - 12 * mm)
        self.y -= 17 * mm

    # ── Spacer ────────────────────────────────────────────────────────────

    def gap(self, n=3):
        self.y -= n * mm

    # ── Office use only (expanded) ────────────────────────────────────────

    def office_box(self):
        # 9 data rows × 9.5 mm + header stripe (10 mm) + top/bottom pad (5 mm) = ~100 mm
        bh  = 102 * mm
        self._np(bh + 5 * mm)
        c   = self.c
        y0  = self.y
        bx  = 3.4 * mm    # checkbox side
        iw  = (CW - 10 * mm) / 2
        P   = MX + 2.5 * mm    # inner left
        R   = MX + iw + 10 * mm  # right column

        # Outer border + fill
        c.setFillColor(SL1)
        c.setStrokeColor(SL3)
        c.setLineWidth(1.2)
        c.roundRect(MX, y0 - bh, CW, bh, 3, fill=1, stroke=1)
        # Header stripe
        c.setFillColor(SL7)
        c.roundRect(MX, y0 - 10 * mm, CW, 10 * mm, 3, fill=1, stroke=0)
        c.setFillColor(white)
        c.setFont("Helvetica-Bold", 9)
        c.drawString(MX + 3 * mm, y0 - 7 * mm,
                     "  FOR OFFICE USE ONLY  —  DO NOT WRITE IN THIS SECTION")

        def ifield(x, iy, w, lbl):
            c.setFont("Helvetica", 7.3)
            c.setFillColor(SL5)
            c.drawString(x, iy + 1.5 * mm, lbl)
            c.setStrokeColor(SL3)
            c.setLineWidth(0.6)
            c.line(x, iy - 4.2 * mm, x + w, iy - 4.2 * mm)

        def icb(x, iy, lbl):
            c.setStrokeColor(SL7)
            c.setLineWidth(0.7)
            c.rect(x, iy - 2, bx, bx, fill=0, stroke=1)
            c.setFont("Helvetica", 7.3)
            c.setFillColor(SL9)
            c.drawString(x + bx + 1 * mm, iy + 0.5 * mm, lbl)
            return x + bx + 1 * mm + c.stringWidth(lbl, "Helvetica", 7.3) + 4 * mm

        iy = y0 - 14.5 * mm

        # Row 1
        ifield(P, iy, iw, "Received By")
        ifield(R, iy, iw, "Received Date")
        iy -= 9.5 * mm

        # Row 2
        ifield(P, iy, iw, "Submission Source")
        ifield(R, iy, iw, "Intake ID")
        iy -= 9.5 * mm

        # Row 3
        ifield(P, iy, iw, "Application ID  (assigned on entry)")
        c.setFont("Helvetica", 7.3)
        c.setFillColor(SL5)
        c.drawString(R, iy + 1.5 * mm, "Completeness Check:")
        nx = R + c.stringWidth("Completeness Check:", "Helvetica", 7.3) + 2.5 * mm
        nx = icb(nx, iy, "Complete")
        icb(nx, iy, "Incomplete")
        iy -= 9.5 * mm

        # Row 4
        ifield(P, iy, CW - 5 * mm, "Missing Information  (if any)")
        iy -= 9.5 * mm

        # Row 5
        ifield(P, iy, CW - 5 * mm, "Admin Notes")
        iy -= 9.5 * mm

        # Row 6  [NEW]
        ifield(P, iy, iw, "Verified By")
        ifield(R, iy, iw, "Data Entry Done By")
        iy -= 9.5 * mm

        # Row 7  [NEW]
        ifield(P, iy, CW - 5 * mm, "Public Domain Review Status")
        iy -= 9.5 * mm

        # Row 8  [NEW]
        c.setFont("Helvetica", 7.3)
        c.setFillColor(SL5)
        c.drawString(P, iy + 1.5 * mm, "Jury Review Required:")
        nx = P + c.stringWidth("Jury Review Required:", "Helvetica", 7.3) + 2.5 * mm
        nx = icb(nx, iy, "Yes")
        icb(nx, iy, "No")
        iy -= 9.5 * mm

        # Row 9
        c.setFont("Helvetica", 7.3)
        c.setFillColor(SL5)
        c.drawString(P, iy + 1.5 * mm, "Converted to Digital Idea Record:")
        nx = P + c.stringWidth("Converted to Digital Idea Record:", "Helvetica", 7.3) + 2.5 * mm
        nx = icb(nx, iy, "Yes")
        icb(nx, iy, "No")

        self.y -= bh + 4 * mm


# ══════════════════════════════════════════════════════════════════════════
def build(out_path):
    f = FormPDF(out_path)
    c = f.c

    # ═════════════════════════════════════════════════════════════════════
    # PAGE 1 — Header + Info + Sections A / B / C
    # ═════════════════════════════════════════════════════════════════════

    # Top brand bar
    bar_h = 10 * mm
    c.setFillColor(EMR_D)
    c.rect(MX, TOP - bar_h, CW, bar_h, fill=1, stroke=0)
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(MX + 4 * mm, TOP - 7 * mm, "NMF × IFIA INNOVATION HUB")
    c.setFont("Helvetica", 7.8)
    c.drawRightString(W - MX - 4 * mm, TOP - 7 * mm, "nmfinventa.ourtestzone.in")
    f.y -= bar_h + 3 * mm

    # Form title block
    c.setFont("Helvetica-Bold", 17)
    c.setFillColor(SL9)
    c.drawCentredString(W / 2, f.y - 8 * mm, "OFFLINE IDEA SUBMISSION FORM")
    c.setFont("Helvetica", 8.5)
    c.setFillColor(SL5)
    c.drawCentredString(W / 2, f.y - 13.5 * mm,
        "For Students  ·  Farmers  ·  Researchers  ·  Innovators  ·  Teachers  ·  Technicians  ·  Everyone with an Idea")
    f.y -= 18 * mm

    # Accent rule
    c.setStrokeColor(EMR)
    c.setLineWidth(1.8)
    c.line(MX, f.y - 1 * mm, W - MX, f.y - 1 * mm)
    f.y -= 5 * mm

    # Info note
    f.note_box([
        "! Idea submission is FREE and OPEN. Membership is optional — it is not required to submit an idea.",
        "  Fill this form clearly in pen or ink. Attach additional sheets, photos, or sketches if needed.",
        "! After submission you will receive an Application ID to track your idea at nmfinventa.ourtestzone.in",
    ])
    f.gap(2)

    # ── SECTION A: Applicant Details ──────────────────────────────────────
    f.sec("A", "Applicant Details")
    f.frow("Full Name", "Phone Number")
    f.frow("Email Address", "Age")
    f.frow("Gender  (M / F / Other / Prefer not to say)",
           "Location  —  City / Village / District")
    f.frow("State", "Organization / School / College / Startup / Institution")
    f.ffull("Preferred Language  (e.g. English, Kannada, Hindi, Tamil, Telugu, etc.)")
    f.gap(3)

    # K12 / Guardian subsection
    f.k12_box()
    f.gap(2)

    # ── SECTION B: Applicant Type ─────────────────────────────────────────
    f.sec("B", "Applicant Type  —  Tick one or more")
    f.cbgrid([
        "Student",
        "Individual Innovator",
        "Team / Group",
        "Startup / Entrepreneur",
        "Farmer / Rural Innovator",
        "Researcher",
        "Teacher / Educator",
        "Technician / Engineer",
        "NGO / Community Group",
        "Institution / University",
        "Other: _______________________",
    ], cols=3)
    f.gap(2)

    # ── SECTION C: Submission Track ───────────────────────────────────────
    f.sec("C", "Program / Submission Track  —  Tick One Primary Track")
    f.cbgrid([
        "Local / Regional Innovation",
        "National / International Innovation",
        "K-12 / School Innovation",
        "IFIA / Partner Referral",
        "Other: __________________________________",
    ], cols=2)
    f.gap(3)

    # ═════════════════════════════════════════════════════════════════════
    # PAGE 2 — Section D (Idea Details — all long-answer boxes)
    # ═════════════════════════════════════════════════════════════════════
    f._force_np()

    # ── SECTION D: Idea Details ───────────────────────────────────────────
    f.sec("D", "Idea Details")
    f.ffull("Idea Title  —  give your idea a short, clear name")
    f.gap(3)

    f.tbox(
        "What problem does your idea solve?",
        40,
        "Describe the problem clearly. Who faces it? How many people are affected? Why is it serious?",
    )
    f.tbox(
        "Explain your solution / innovation in detail",
        55,
        "How does your idea work? What is the method, product, or process? Include any key steps or components.",
    )
    f.tbox(
        "Who will benefit from this idea?",
        30,
        "Describe the people who will benefit — e.g. rural farmers, school children, patients, small businesses, etc.",
    )
    f.tbox(
        "Where and how can this idea be used?",
        27,
        "e.g. villages, hospitals, schools, factories, homes, outdoor settings, across India, globally, etc.",
    )
    f.tbox(
        "What makes your idea new or different from existing solutions?",
        38,
        "What is unique, better, cheaper, simpler, or more accessible about your idea compared to what already exists?",
    )
    f.gap(2)

    # ═════════════════════════════════════════════════════════════════════
    # PAGE 3 — Sections E / F / G / H  (categories & support)
    # ═════════════════════════════════════════════════════════════════════
    f._force_np()

    # ── SECTION E: Innovation Category ───────────────────────────────────
    f.sec("E", "Innovation Category  —  Tick one or more")
    f.cbgrid([
        "Agriculture & Farming",
        "Water & Sanitation",
        "Waste Management",
        "Healthcare / Medical",
        "Education & Learning",
        "Environment & Climate",
        "Assistive Technology",
        "AI / Technology / Digital",
        "Renewable Energy",
        "Women Safety & Empowerment",
        "Rural Innovation",
        "Food & Nutrition",
        "Transportation & Mobility",
        "Other: ________________________",
    ], cols=3)
    f.gap(4)

    # ── SECTION F: Prototype Status ───────────────────────────────────────
    f.sec("F", "Prototype / Development Status  —  Tick one")
    f.cbgrid([
        "Only an idea / concept  (nothing built yet)",
        "Drawing or sketch available",
        "Basic prototype or model available",
        "Working model ready for demonstration",
        "Product already tested with real users",
        "Need help to build a prototype",
    ], cols=2)
    f.gap(4)

    # ── SECTION G: Support Needed ─────────────────────────────────────────
    f.sec("G", "Support Needed  —  Tick all that apply")
    f.cbgrid([
        "Mentorship from experts",
        "Prototype development support",
        "Technical review & feedback",
        "Funding / Grant guidance",
        "Patent / IP guidance",
        "Incubation support",
        "Exhibition / Showcase opportunity",
        "Market access / Commercialization",
        "Legal support",
        "Networking with innovators",
        "Other: _______________________",
    ], cols=3)
    f.gap(4)

    # ── SECTION H: Attachments Checklist ─────────────────────────────────
    f.sec("H", "Attachments Checklist  —  Tick what you are including with this form")
    f.cbgrid([
        "Additional written document",
        "Letter / Handwritten explanation",
        "Photographs of prototype or idea",
        "Design sketches or diagrams",
        "Audio recording  (on USB / device)",
        "Video demonstration  (on USB / device)",
        "Research notes or reports",
        "Other: ____________________________",
    ], cols=2)
    f.gap(3)

    # ═════════════════════════════════════════════════════════════════════
    # PAGE 4 — Sections I (Declaration) + J (Office Use Only)
    # ═════════════════════════════════════════════════════════════════════
    f._force_np()

    # ── SECTION I: Declaration & Consent ─────────────────────────────────
    f.sec("I", "Declaration and Consent")
    f.decl_box([
        (False,
         "I confirm that the information provided in this form is true and accurate to the best of my "
         "knowledge. I understand that the idea submitted will be reviewed by the NMF-IFIA Innovation Hub "
         "team and may be evaluated by field-specific jury experts."),
        (False,
         "I agree to be contacted by NMF-IFIA representatives via the phone number and email provided, "
         "for follow-up, clarification, additional information, mentoring, prototype support, or further "
         "programme opportunities."),
        (True,
         "I declare that this idea is my own original work (or developed by my team) and does not "
         "infringe any existing patents, copyrights, or intellectual property rights. I take full "
         "responsibility for the authenticity of the content provided."),
    ])
    f.gap(2)
    f.sig_row(["Applicant Signature", "Date  (DD / MM / YYYY)", "Place"])
    f.gap(5)

    # ── SECTION J: Office Use Only ────────────────────────────────────────
    f.sec("J", "For Office Use Only")
    f.office_box()
    f.gap(4)

    # Bottom notes
    f._np(18 * mm)
    c.setFont("Helvetica-Oblique", 7.5)
    c.setFillColor(SL5)
    c.drawCentredString(W / 2, f.y - 3 * mm,
        "After submission, the applicant will receive an Application ID to track their idea at nmfinventa.ourtestzone.in")
    c.drawCentredString(W / 2, f.y - 8 * mm,
        "Attach additional sheets, photos, sketches, documents, or prototype details if required.")
    f.y -= 13 * mm
    c.setFont("Helvetica-Bold", 7.5)
    c.setFillColor(EMR_D)
    c.drawCentredString(W / 2, f.y - 3 * mm,
        "Submit this completed form to your nearest NMF centre or mail to: "
        "NMF × IFIA Innovation Hub, Mysuru, Karnataka, India")

    f.save()
    print(f"PDF saved: {out_path}")


if __name__ == "__main__":
    out = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "offline-form.pdf")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    build(out)
