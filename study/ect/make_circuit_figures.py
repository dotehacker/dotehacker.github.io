"""Generate circuit schematics for the ECT study site.

One function per figure. Each function builds a schemdraw Drawing,
saves a PNG into ../plots/, and is registered in MANIFEST. Run the
whole module to regenerate all figures:

    python3 study/ect/make_circuit_figures.py

Output PNGs land in study/ect/plots/. The build pipeline (build.js)
copies them to docs/study/ect/plots/ automatically.

Theme: dark high-contrast (white lines on near-black) matching the
ECT site's --bg-primary palette.
"""
import os
import matplotlib.pyplot as plt
import schemdraw
import schemdraw.elements as elm

HERE = os.path.dirname(os.path.abspath(__file__))
PLOTS_DIR = os.path.join(HERE, 'plots')

# ---------------------------------------------------------------------------
# Dark high-contrast theme
# ---------------------------------------------------------------------------
BG = '#0e0f13'
FG = '#e7ecf3'


def setup_dark():
    plt.rcParams['axes.facecolor'] = BG
    plt.rcParams['figure.facecolor'] = BG
    plt.rcParams['savefig.facecolor'] = BG
    plt.rcParams['text.color'] = FG
    plt.rcParams['axes.edgecolor'] = FG
    plt.rcParams['axes.labelcolor'] = FG
    plt.rcParams['xtick.color'] = FG
    plt.rcParams['ytick.color'] = FG


def render(filename: str, builder, dpi: int = 150):
    """Build a schemdraw Drawing via builder(d) and save to plots/<filename>."""
    setup_dark()
    with schemdraw.Drawing(canvas='matplotlib', show=False, color=FG, lw=2) as d:
        d.config(fontsize=14)
        builder(d)
        fig = d.draw()
    fig.fig.set_facecolor(BG)
    out_path = os.path.join(PLOTS_DIR, filename)
    fig.fig.savefig(out_path, dpi=dpi, bbox_inches='tight', facecolor=BG)
    plt.close('all')
    return out_path


# ===========================================================================
# Q1b — Initial-conditions problems (two-mesh switching circuits)
# ===========================================================================

def fig_q_2082_baishakh_q1b(d):
    """[2082 Baishakh Q1b] Switch closed t=0. 10 V, R=10 Ω, L=1 H, R'=1/10 Ω,
    C=1 F (V_C(0-)=2 V). Two-mesh."""
    d += (S := elm.SourceV().label('10 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d += elm.Line().right()
    d.push()
    d += elm.Inductor().label('1 H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('1/10 Ω', loc='top').right()
    d += elm.Capacitor().label('1 F\n$V_C(0^-){=}2$ V', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_bhadra_q1b(d):
    """[2081 Bhadra Q1b] Switch closed t=0; standard two-mesh inferred:
    Vs - R1 - (L parallel with R2-C branch). Topology inferred."""
    d += (S := elm.SourceV().label('$V_s$').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('$R_1$', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L$', loc='right').down()
    d.pop()
    d += elm.Resistor().label('$R_2$', loc='top').right()
    d += elm.Capacitor().label('$C$', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_baishakh_q1b(d):
    """[2081 Baishakh Q1b] Switch closed t=0. 10 V, 1 Ω resistors, 1 F cap, 3 H ind."""
    d += (S := elm.SourceV().label('10 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('1 F', loc='right').down()
    d.pop()
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d += elm.Inductor().label('3 H', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_bhadra_q1b(d):
    """[2080 Bhadra Q1b] 100 V, 10 Ω, 2 H inductor, 20 Ω, 2 F. Two-mesh."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('2 H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('20 Ω', loc='top').right()
    d += elm.Capacitor().label('2 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_baishakh_q1b(d):
    """[2080 Baishakh Q1b] $10e^{vt}$ V, 3 H inductor, 5 Ω, 1 F."""
    d += (S := elm.SourceV().label('$10e^{vt}$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('5 Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('3 H', loc='right').down()
    d.pop()
    d += elm.Capacitor().label('1 F', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_bhadra_q1b(d):
    """[2079 Bhadra Q1b] 50 V, 2 µF, 10 Ω, 2 mH inductor."""
    d += (S := elm.SourceV().label('50 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('2 µF', loc='right').down()
    d.pop()
    d += elm.Inductor().label('2 mH', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_baishakh_q1b(d):
    """[2079 Baishakh Q1b] L1=2 mH, L2=6 mH, R1=10 kΩ, R2=5 kΩ, i_L1(0)=2 A.
    Topology inferred — standard two-coil with shared resistor."""
    d += (S := elm.SourceV().label('$V_s$').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('$R_1{=}10$ kΩ', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L_1{=}2$ mH\n$i_{L_1}(0){=}2$ A', loc='right').down()
    d.pop()
    d += elm.Resistor().label('$R_2{=}5$ kΩ', loc='top').right()
    d += elm.Inductor().label('$L_2{=}6$ mH', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


# ===========================================================================
# Q2 — Transient (classical method)
# ===========================================================================

def fig_q_2082_baishakh_q2a(d):
    """[2082 Baishakh Q2a] Switch opens t=0. 12 V, 4 Ω, L=0.1 H, parallel 20 Ω."""
    d += (S := elm.SourceV().label('12 V').up())
    d += elm.Resistor().label('4 Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Inductor().label('0.1 H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('20 Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2082_baishakh_q2b(d):
    """[2082 Baishakh Q2b] Switch closed t=0. 10 sin(10^4 t + 60°) V, 2 Ω, 0.01 H, RL series."""
    d += (S := elm.SourceSin().label('$10\\sin(10^4 t{+}60°)$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('2 Ω', loc='top').right()
    d += elm.Inductor().label('0.01 H', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_bhadra_q3a(d):
    """[2081 Bhadra Q3a] Switch closed t=0. 10 V, 2 Ω, 1 Ω, 0.5 F. Two-mesh."""
    d += (S := elm.SourceV().label('10 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('2 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('0.5 F', loc='right').down()
    d.pop()
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_baishakh_q2a(d):
    """[2081 Baishakh Q2a] Switch closed t=0. 25 sin(10t) V, 1 Ω, 1 F. RC series."""
    d += (S := elm.SourceSin().label('$25\\sin(10t)$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d += elm.Capacitor().label('1 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_baishakh_q2b(d):
    """[2081 Baishakh Q2b] $v=6e^{-t}$ V, 5 Ω, 1 H, 0.25 F. RLC series."""
    d += (S := elm.SourceV().label('$6e^{-t}$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('5 Ω', loc='top').right()
    d += elm.Inductor().label('1 H', loc='top').right()
    d += elm.Capacitor().label('0.25 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_bhadra_q2a(d):
    """[2080 Bhadra Q2a] Switch closed t=0. 50 V, 10 Ω, 2 µF. Two-mesh."""
    d += (S := elm.SourceV().label('50 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('2 µF', loc='right').down()
    d.pop()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_bhadra_q2b(d):
    """[2080 Bhadra Q2b] Switch closed long, opens t=0. 12 V, 5 Ω, L=1 H, 2 F."""
    d += (S := elm.SourceV().label('12 V').up())
    d += elm.Resistor().label('5 Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Inductor().label('1 H', loc='right').down()
    d.pop()
    d += elm.Capacitor().label('2 F', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_baishakh_q2a(d):
    """[2080 Baishakh Q2a] 100 V, 10 Ω, L1=3 H, 15 Ω, L2=2 H. Two-coil two-mesh."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L_1{=}3$ H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('15 Ω', loc='top').right()
    d += elm.Inductor().label('$L_2{=}2$ H', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_baishakh_q2b(d):
    """[2080 Baishakh Q2b] 100 V, 20 Ω, 10 Ω, 10 mH, 100 F."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('20 Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('10 mH', loc='right').down()
    d.pop()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d += elm.Capacitor().label('100 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_bhadra_q2a(d):
    """[2079 Bhadra Q2a] Switch closed t=0. 100 V, 20 Ω resistors, 10 Ω, 20 µF."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('20 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('20 µF', loc='right').down()
    d.pop()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d += elm.Resistor().label('20 Ω', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_bhadra_q2b(d):
    """[2079 Bhadra Q2b] 20 V, 10 V sources, 30 Ω, 70 Ω, 0.5 H, 1 F. Two-mesh."""
    d += (S := elm.SourceV().label('20 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('30 Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('0.5 H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('70 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('1 F', loc='right').down()
    d.pop()
    d += elm.SourceV().label('10 V', loc='top').right().reverse()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_baishakh_q2b(d):
    """[2079 Baishakh Q2b] Exponential current $i(t)=20e^{5t}$ A applied to parallel
    RLC: R=1/10 Ω, L=10 mH, C=2.5 µF. Inferred parallel topology."""
    d += (S := elm.SourceI().label('$20e^{5t}$ A').up())
    d += elm.Line().right()
    d.push()
    d += elm.Resistor().label('1/10 Ω', loc='right').down()
    d.pop()
    d += elm.Line().right()
    d.push()
    d += elm.Inductor().label('10 mH', loc='right').down()
    d.pop()
    d += elm.Line().right()
    d += elm.Capacitor().label('2.5 µF', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


# ===========================================================================
# Q3 — Laplace transform problems
# ===========================================================================

def fig_q_2082_baishakh_q3a(d):
    """[2082 Baishakh Q3a] $20e^{-t}$ V applied to RLC series (4 Ω, 1 H, 1/3 F)."""
    d += (S := elm.SourceV().label('$20e^{-t}$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('4 Ω', loc='top').right()
    d += elm.Inductor().label('1 H', loc='top').right()
    d += elm.Capacitor().label('1/3 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2082_baishakh_q3b(d):
    """[2082 Baishakh Q3b] Steady state, switch opens t=0. 6 V, R1=6 Ω series,
    R2=3 Ω parallel L (and C=1 F across same node)."""
    d += (S := elm.SourceV().label('6 V').up())
    d += elm.Resistor().label('6 Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L$', loc='right').down()
    d.pop()
    d.push()
    d += elm.Resistor().label('3 Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d.pop()
    d += elm.Capacitor().label('1 F', loc='right').down()
    d += elm.Line().toy(S.start)


def fig_q_2081_bhadra_q2a(d):
    """[2081 Bhadra Q2a] Switch opened t=0, steady state before. 11 V, 1 H, 1 Ω, 1/9 F."""
    d += (S := elm.SourceV().label('11 V').up())
    d += elm.Inductor().label('1 H', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Resistor().label('1 Ω', loc='right').down()
    d.pop()
    d += elm.Capacitor().label('1/9 F', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_bhadra_q3b(d):
    """[2081 Bhadra Q3b] Two-mesh, switch closed t=0. 60 V, 20 µF, 0.8 H. Inferred."""
    d += (S := elm.SourceV().label('60 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('$R_1$', loc='top').right()
    d.push()
    d += elm.Capacitor().label('20 µF', loc='right').down()
    d.pop()
    d += elm.Resistor().label('$R_2$', loc='top').right()
    d += elm.Inductor().label('0.8 H', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_baishakh_q3a(d):
    """[2081 Baishakh Q3a] Switch moved 1→2 at t=0. 24 V, 12 Ω, 6 Ω, 1/36 F.
    Inferred standard two-position-switch topology."""
    d += (S := elm.SourceV().label('24 V').up())
    d += elm.SwitchSpdt2(action='close').label('t=0  (1→2)', loc='top').right()
    d += elm.Resistor().label('12 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('1/36 F', loc='right').down()
    d.pop()
    d += elm.Resistor().label('6 Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2081_baishakh_q3b(d):
    """[2081 Baishakh Q3b] Switch opens t=0. 12 V, 1 Ω, 0.5 H, 5 Ω, 2 F."""
    d += (S := elm.SourceV().label('12 V').up())
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Inductor().label('0.5 H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('5 Ω', loc='top').right()
    d += elm.Capacitor().label('2 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_bhadra_q3a(d):
    """[2080 Bhadra Q3a] s1 closes t=0, s2 opens t=4 ms. 100 V, 50 Ω, 100 Ω, L."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Switch(action='close').label('$s_1$\nt=0', loc='top').right()
    d += elm.Resistor().label('50 Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L$', loc='right').down()
    d.pop()
    d += elm.Switch(action='open').label('$s_2$\nt=4 ms', loc='top').right()
    d += elm.Resistor().label('100 Ω', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_bhadra_q3b(d):
    """[2080 Bhadra Q3b] Parallel: C=1 F (V0=10 V), 0.25 Ω, L=1/10 H. Switch closes t=0."""
    d += (C := elm.Capacitor().label('1 F\n$V_0{=}10$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Line().right()
    d.push()
    d += elm.Resistor().label('0.25 Ω', loc='right').down()
    d.pop()
    d += elm.Line().right()
    d += elm.Inductor().label('1/10 H', loc='right').down()
    d += elm.Line().left().tox(C.start)
    d += elm.Line().toy(C.start)


def fig_q_2080_baishakh_q3a(d):
    """[2080 Baishakh Q3a] $10e^{-t}$ V, 4 Ω, 1 H, 1/3 F series."""
    d += (S := elm.SourceV().label('$10e^{-t}$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('4 Ω', loc='top').right()
    d += elm.Inductor().label('1 H', loc='top').right()
    d += elm.Capacitor().label('1/3 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2080_baishakh_q3b(d):
    """[2080 Baishakh Q3b] Source-free: C=1 F (V0=10 V), 4 Ω, L=3 H series."""
    d += (C := elm.Capacitor().label('1 F\n$V_0{=}10$ V').up())
    d += elm.Resistor().label('4 Ω', loc='top').right()
    d += elm.Inductor().label('3 H', loc='right').down()
    d += elm.Line().left().tox(C.start)
    d += elm.Line().toy(C.start)


def fig_q_2079_bhadra_q3a(d):
    """[2079 Bhadra Q3a] $10e^{-7t}$ V, 10 Ω, 1 H, 1/100 F series."""
    d += (S := elm.SourceV().label('$10e^{-7t}$ V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('10 Ω', loc='top').right()
    d += elm.Inductor().label('1 H', loc='top').right()
    d += elm.Capacitor().label('1/100 F', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_bhadra_q3b(d):
    """[2079 Bhadra Q3b] Two-loop. 10 V, 1 F, 1/6 H, 1/5 Ω."""
    d += (S := elm.SourceV().label('10 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('1/5 Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('1 F', loc='right').down()
    d.pop()
    d += elm.Inductor().label('1/6 H', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_baishakh_q3a(d):
    """[2079 Baishakh Q3a] Steady state, switch opens t=0. 100 V, 20 Ω, 10 Ω, 3 F."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Resistor().label('20 Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Resistor().label('10 Ω', loc='right').down()
    d.pop()
    d += elm.Capacitor().label('3 F', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_q_2079_baishakh_q3b(d):
    """[2079 Baishakh Q3b] Switch closed t=0, steady state before. 100 V,
    R1=10 Ω, R2=20 Ω, R3=20 Ω, L=1 H, C=1 µF. Inferred two-mesh."""
    d += (S := elm.SourceV().label('100 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('$R_1{=}10$ Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L{=}1$ H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('$R_2{=}20$ Ω', loc='top').right()
    d.push()
    d += elm.Capacitor().label('1 µF', loc='right').down()
    d.pop()
    d += elm.Resistor().label('$R_3{=}20$ Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


# ===========================================================================
# Q4 / Q5 — Two-port networks
# ===========================================================================

def _twoport_ports(d, x_left, x_right, y_top, y_bot):
    """Helper: draw the four port dots/labels at the given coordinates."""
    d += elm.Dot().at((x_left, y_top))
    d += elm.Label().at((x_left - 0.4, y_top)).label('1')
    d += elm.Dot().at((x_left, y_bot))
    d += elm.Label().at((x_left - 0.4, y_bot)).label("1'")
    d += elm.Dot().at((x_right, y_top))
    d += elm.Label().at((x_right + 0.4, y_top)).label('2')
    d += elm.Dot().at((x_right, y_bot))
    d += elm.Label().at((x_right + 0.4, y_bot)).label("2'")


def fig_q_2082_baishakh_q4a(d):
    """[2082 Baishakh Q4a] Two-port: 1 Ω + 2 H series, 2 Ω shunt at output."""
    d += elm.Line().right().length(1)  # left port stub
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d += elm.Inductor().label('2 H', loc='top').right()
    d.push()
    d += elm.Resistor().label('2 Ω', loc='right').down()
    d += elm.Line().left().length(7)
    d.pop()
    d += elm.Line().right().length(1)
    # Add port labels manually
    d += elm.Label().at((-1, 0)).label("1'")
    d += elm.Dot().at((0, 0))


def fig_q_2081_baishakh_q4a(d):
    """[2081 Baishakh Q4a] Two-port ladder: 1 H series, 1 F shunt, 1 Ω series, 1 Ω shunt."""
    d += elm.Inductor().label('1 H', loc='top').right()
    d.push()
    d += elm.Capacitor().label('1 F', loc='right').down()
    d += elm.Line().left().length(3)
    d.pop()
    d += elm.Resistor().label('1 Ω', loc='top').right()
    d.push()
    d += elm.Resistor().label('1 Ω', loc='right').down()
    d += elm.Line().left().length(3)
    d.pop()


def fig_q_2080_baishakh_q4a(d):
    """[2080 Baishakh Q4a] Ladder: 1 H series, 1 Ω shunt, 2 H series, 2 Ω shunt."""
    d += elm.Inductor().label('1 H', loc='top').right()
    d.push()
    d += elm.Resistor().label('1 Ω', loc='right').down()
    d += elm.Line().left().length(3)
    d.pop()
    d += elm.Inductor().label('2 H', loc='top').right()
    d.push()
    d += elm.Resistor().label('2 Ω', loc='right').down()
    d += elm.Line().left().length(3)
    d.pop()


def fig_q_2080_baishakh_q5a(d):
    """[2080 Baishakh Q5a] Two-port with 3I_1 dependent current source.
    Inferred standard CCCS topology."""
    d += elm.Line().right().length(1)
    d += elm.Resistor().label('$R_1$', loc='top').right()
    d.push()
    d += elm.SourceI().label('$3 I_1$', loc='right').down()
    d += elm.Line().left().length(3)
    d.pop()
    d += elm.Resistor().label('$R_2$', loc='top').right()
    d += elm.Line().right().length(1)


def fig_q_2079_baishakh_q5a(d):
    """[2079 Baishakh Q5a] Two-port with 3V_1 dependent voltage source.
    Inferred standard VCVS topology."""
    d += elm.Line().right().length(1)
    d += elm.Resistor().label('$R_1$', loc='top').right()
    d.push()
    d += elm.SourceControlledV().label('$3 V_1$', loc='right').down()
    d += elm.Line().left().length(3)
    d.pop()
    d += elm.Resistor().label('$R_2$', loc='top').right()
    d += elm.Line().right().length(1)


# ===========================================================================
# Chapter worked-example figures
# ===========================================================================

def fig_ch2_q1_switching(d):
    """[ch2_initial_conditions.md] Switch closes t=0. 10 V, R1=R2=10 Ω, L=1 H,
    C=1 F (V_C(0-)=2 V)."""
    d += (S := elm.SourceV().label('10 V').up())
    d += elm.Switch(action='close').label('t=0', loc='top').right()
    d += elm.Resistor().label('$R_1{=}10$ Ω', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L{=}1$ H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('$R_2{=}10$ Ω', loc='top').right()
    d += elm.Capacitor().label('$C{=}1$ F\n$V_C(0^-){=}2$ V', loc='right').down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_ch3_q1_rl_transient(d):
    """[ch3_transient_direct.md] Switch closed long, opens t=0. 12 V, 4 Ω,
    L=0.1 H, 20 Ω parallel inductor."""
    d += (S := elm.SourceV().label('12 V').up())
    d += elm.Resistor().label('4 Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L{=}0.1$ H', loc='right').down()
    d.pop()
    d += elm.Resistor().label('20 Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d += elm.Line().toy(S.start)


def fig_ch4_q1_laplace_switch(d):
    """[ch4_laplace_transform.md] V_s=6 V, R1=6 Ω series, R2=3 Ω parallel
    L||C with C=1 F. Steady state with switch closed; switch opens t=0."""
    d += (S := elm.SourceV().label('$V_s{=}6$ V').up())
    d += elm.Resistor().label('$R_1{=}6$ Ω', loc='top').right()
    d += elm.Switch(action='open').label('t=0', loc='top').right()
    d.push()
    d += elm.Inductor().label('$L$', loc='right').down()
    d.pop()
    d.push()
    d += elm.Resistor().label('$R_2{=}3$ Ω', loc='top').right()
    d += elm.Line().down()
    d += elm.Line().left().tox(S.start)
    d.pop()
    d += elm.Capacitor().label('$C{=}1$ F', loc='right').down()
    d += elm.Line().toy(S.start)


# ===========================================================================
# Manifest — every flagged problem
# ===========================================================================

MANIFEST: list[tuple] = [
    # Q1b — initial conditions
    ('2082 Baishakh Q1b',  fig_q_2082_baishakh_q1b,  'q_2082_baishakh_q1b.png',  'faithful'),
    ('2081 Bhadra Q1b',    fig_q_2081_bhadra_q1b,    'q_2081_bhadra_q1b.png',    'inferred'),
    ('2081 Baishakh Q1b',  fig_q_2081_baishakh_q1b,  'q_2081_baishakh_q1b.png',  'faithful'),
    ('2080 Bhadra Q1b',    fig_q_2080_bhadra_q1b,    'q_2080_bhadra_q1b.png',    'faithful'),
    ('2080 Baishakh Q1b',  fig_q_2080_baishakh_q1b,  'q_2080_baishakh_q1b.png',  'faithful'),
    ('2079 Bhadra Q1b',    fig_q_2079_bhadra_q1b,    'q_2079_bhadra_q1b.png',    'faithful'),
    ('2079 Baishakh Q1b',  fig_q_2079_baishakh_q1b,  'q_2079_baishakh_q1b.png',  'inferred'),

    # Q2 — transient classical
    ('2082 Baishakh Q2a',  fig_q_2082_baishakh_q2a,  'q_2082_baishakh_q2a.png',  'faithful'),
    ('2082 Baishakh Q2b',  fig_q_2082_baishakh_q2b,  'q_2082_baishakh_q2b.png',  'faithful'),
    ('2081 Bhadra Q3a',    fig_q_2081_bhadra_q3a,    'q_2081_bhadra_q3a.png',    'faithful'),
    ('2081 Baishakh Q2a',  fig_q_2081_baishakh_q2a,  'q_2081_baishakh_q2a.png',  'faithful'),
    ('2081 Baishakh Q2b',  fig_q_2081_baishakh_q2b,  'q_2081_baishakh_q2b.png',  'faithful'),
    ('2080 Bhadra Q2a',    fig_q_2080_bhadra_q2a,    'q_2080_bhadra_q2a.png',    'faithful'),
    ('2080 Bhadra Q2b',    fig_q_2080_bhadra_q2b,    'q_2080_bhadra_q2b.png',    'faithful'),
    ('2080 Baishakh Q2a',  fig_q_2080_baishakh_q2a,  'q_2080_baishakh_q2a.png',  'faithful'),
    ('2080 Baishakh Q2b',  fig_q_2080_baishakh_q2b,  'q_2080_baishakh_q2b.png',  'faithful'),
    ('2079 Bhadra Q2a',    fig_q_2079_bhadra_q2a,    'q_2079_bhadra_q2a.png',    'faithful'),
    ('2079 Bhadra Q2b',    fig_q_2079_bhadra_q2b,    'q_2079_bhadra_q2b.png',    'faithful'),
    ('2079 Baishakh Q2b',  fig_q_2079_baishakh_q2b,  'q_2079_baishakh_q2b.png',  'inferred'),

    # Q3 — Laplace
    ('2082 Baishakh Q3a',  fig_q_2082_baishakh_q3a,  'q_2082_baishakh_q3a.png',  'faithful'),
    ('2082 Baishakh Q3b',  fig_q_2082_baishakh_q3b,  'q_2082_baishakh_q3b.png',  'faithful'),
    ('2081 Bhadra Q2a',    fig_q_2081_bhadra_q2a,    'q_2081_bhadra_q2a.png',    'faithful'),
    ('2081 Bhadra Q3b',    fig_q_2081_bhadra_q3b,    'q_2081_bhadra_q3b.png',    'inferred'),
    ('2081 Baishakh Q3a',  fig_q_2081_baishakh_q3a,  'q_2081_baishakh_q3a.png',  'inferred'),
    ('2081 Baishakh Q3b',  fig_q_2081_baishakh_q3b,  'q_2081_baishakh_q3b.png',  'faithful'),
    ('2080 Bhadra Q3a',    fig_q_2080_bhadra_q3a,    'q_2080_bhadra_q3a.png',    'faithful'),
    ('2080 Bhadra Q3b',    fig_q_2080_bhadra_q3b,    'q_2080_bhadra_q3b.png',    'faithful'),
    ('2080 Baishakh Q3a',  fig_q_2080_baishakh_q3a,  'q_2080_baishakh_q3a.png',  'faithful'),
    ('2080 Baishakh Q3b',  fig_q_2080_baishakh_q3b,  'q_2080_baishakh_q3b.png',  'faithful'),
    ('2079 Bhadra Q3a',    fig_q_2079_bhadra_q3a,    'q_2079_bhadra_q3a.png',    'faithful'),
    ('2079 Bhadra Q3b',    fig_q_2079_bhadra_q3b,    'q_2079_bhadra_q3b.png',    'faithful'),
    ('2079 Baishakh Q3a',  fig_q_2079_baishakh_q3a,  'q_2079_baishakh_q3a.png',  'faithful'),
    ('2079 Baishakh Q3b',  fig_q_2079_baishakh_q3b,  'q_2079_baishakh_q3b.png',  'inferred'),

    # Q4 / Q5 — two-port (inferred topologies)
    ('2082 Baishakh Q4a',  fig_q_2082_baishakh_q4a,  'q_2082_baishakh_q4a.png',  'inferred'),
    ('2081 Baishakh Q4a',  fig_q_2081_baishakh_q4a,  'q_2081_baishakh_q4a.png',  'inferred'),
    ('2080 Baishakh Q4a',  fig_q_2080_baishakh_q4a,  'q_2080_baishakh_q4a.png',  'inferred'),
    ('2080 Baishakh Q5a',  fig_q_2080_baishakh_q5a,  'q_2080_baishakh_q5a.png',  'inferred'),
    ('2079 Baishakh Q5a',  fig_q_2079_baishakh_q5a,  'q_2079_baishakh_q5a.png',  'inferred'),

    # Chapter worked examples
    ('ch2 Q1 switching',     fig_ch2_q1_switching,     'ch2_q1_switching.png',     'faithful'),
    ('ch3 Q1 RL transient',  fig_ch3_q1_rl_transient,  'ch3_q1_rl_transient.png',  'faithful'),
    ('ch4 Q1 Laplace switch',fig_ch4_q1_laplace_switch,'ch4_q1_laplace_switch.png','faithful'),

    # Skipped — bare component lists / topology not determined
    ('2079 Baishakh Q1a (line 62)',  None, None, 'skipped'),
    ('2079 Baishakh Q1a (line 66)',  None, None, 'skipped'),
    ('2081 Bhadra Q1a',              None, None, 'skipped'),
    ('2079 Baishakh Q2a',            None, None, 'skipped'),
]


def main() -> int:
    os.makedirs(PLOTS_DIR, exist_ok=True)
    counts = {'faithful': 0, 'inferred': 0, 'skipped': 0}
    failures = []
    for problem_id, func, filename, status in MANIFEST:
        counts[status] = counts.get(status, 0) + 1
        if func is None:
            print(f'  SKIP   {problem_id}')
            continue
        try:
            path = render(filename, func)
            print(f'  WROTE  {problem_id:30s} -> {os.path.basename(path)}')
        except Exception as e:
            failures.append((problem_id, e))
            print(f'  FAIL   {problem_id:30s} -- {e}')
    print()
    print(f'Summary: {counts.get("faithful", 0)} faithful, '
          f'{counts.get("inferred", 0)} inferred, '
          f'{counts.get("skipped", 0)} skipped, '
          f'total {sum(counts.values())} entries')
    if failures:
        print(f'  {len(failures)} failures:')
        for pid, e in failures:
            print(f'    {pid}: {e}')
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
