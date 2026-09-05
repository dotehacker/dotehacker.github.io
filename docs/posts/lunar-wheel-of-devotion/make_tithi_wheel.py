"""Generate the Lunar Wheel of Devotion data + figure.

Reads a structured spec (Narada Purana paksha-specific deities + Jayanti
reinforcements) and produces:
  - tithi-data.csv  (human-readable scoring table)
  - tithi-wheel.png (the figure: polar wheel + stacked bar)

Scoring rule (Path 3 hybrid):
  1. Base from Narada Purana: each paksha contributes 0.5 to its deity's
     stream. If a deity folds to a split, split that paksha's 0.5 across
     the streams.
  2. Jayanti contributions added on top:
       major pan-Hindu Jayanti = 0.15
       avatar Jayanti           = 0.10
       Devi/Shakta vrat         = 0.10
       monthly recurrence       = 0.20  (Ekadashi, Pradosh, Masik Shivratri)
       cross-stream Jayanti     = weight split 50/50 between two streams
  3. Floor any zero stream at 0.05.
  4. Normalize to sum 1.0.
  5. Cap any stream at 0.85 (excess redistributed proportionally to others).
"""
import csv
import math
import os

import matplotlib.pyplot as plt
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(HERE, 'tithi-data.csv')
PNG_PATH = os.path.join(HERE, 'tithi-wheel.png')

STREAMS = ('shiva', 'shakti', 'vishnu')

STREAM_COLORS = {
    'shiva':  '#3a4a5c',  # ash-blue
    'shakti': '#c0392b',  # crimson
    'vishnu': '#e8a33d',  # saffron
}

# Folding rules: Narada Purana deity name -> stream weights summing to 1.0
FOLD = {
    # Vishnu stream
    'Brahma':     {'vishnu': 1.0},
    'Virinchi':   {'vishnu': 1.0},
    'Vishnu':     {'vishnu': 1.0},
    'Hari':       {'vishnu': 1.0},
    'Surya':      {'vishnu': 1.0},
    'Ravi':       {'vishnu': 1.0},
    'Indra':      {'vishnu': 1.0},
    'Mahendra':   {'vishnu': 1.0},
    'Vaasava':    {'vishnu': 1.0},
    'Chandrama':  {'vishnu': 1.0},  # Chandra-vamsha rationale
    # Shiva stream
    'Shiva':      {'shiva': 1.0},
    'Shankara':   {'shiva': 1.0},
    'Yama':       {'shiva': 1.0},
    'Dandadhara': {'shiva': 1.0},   # Yama-epithet
    'Kalaadhara': {'shiva': 1.0},   # Time-bearer / Shiva-epithet
    'Pitrs':      {'shiva': 1.0},
    'Sarpa':      {'shiva': 1.0},   # Naga as Shiva's ornament
    'Naga':       {'shiva': 1.0},
    # Shakti stream
    'Durga':      {'shakti': 1.0},
    'Gauri':      {'shakti': 1.0},
    'Ganesha':    {'shakti': 1.0},   # Devi-Shiva household
    'Kartikeya':  {'shakti': 1.0},   # Devi's son
    'Kaama':      {'shakti': 1.0},
    # Split deities
    'Agni':       {'shiva': 0.5, 'shakti': 0.5},
}

# Narada Purana 56.133b-135 paksha-specific deity assignments.
# Tithi #15 unifies Purnima (S15=Naga) and Amavasya (K15=Pitrs).
NARADA = [
    # (num, name,        shukla_deity,  krishna_deity)
    ( 1, 'Pratipada',   'Brahma',     'Durga'),
    ( 2, 'Dwitiya',     'Agni',       'Dandadhara'),
    ( 3, 'Tritiya',     'Virinchi',   'Shiva'),
    ( 4, 'Chaturthi',   'Vishnu',     'Vishnu'),
    ( 5, 'Panchami',    'Gauri',      'Hari'),
    ( 6, 'Shashthi',    'Ganesha',    'Ravi'),
    ( 7, 'Saptami',     'Yama',       'Kaama'),
    ( 8, 'Ashtami',     'Sarpa',      'Shankara'),
    ( 9, 'Navami',      'Chandrama',  'Kalaadhara'),
    (10, 'Dashami',     'Kartikeya',  'Yama'),
    (11, 'Ekadashi',    'Surya',      'Chandrama'),
    (12, 'Dwadashi',    'Indra',      'Vishnu'),
    (13, 'Trayodashi',  'Mahendra',   'Kaama'),
    (14, 'Chaturdashi', 'Vaasava',    'Shiva'),
    (15, 'Purnima/Amavasya', 'Naga',  'Pitrs'),
]

# Jayanti reinforcements: list of (tithi_num, label, contributions)
# `contributions` is a list of (stream, weight) tuples; cross-stream Jayantis
# are encoded as two entries.
JAYANTIS = [
    # ----- Vishnu stream -----
    ( 1, 'Govardhan Puja (Shukla Pratipada Kartika)', [('vishnu', 0.10)]),
    ( 2, 'Rath Yatra (Shukla Dwitiya Ashadha)',       [('vishnu', 0.10)]),
    ( 3, 'Akshaya Tritiya / Parashurama Jayanti',     [('vishnu', 0.10)]),
    ( 3, 'Matsya Jayanti (Shukla Tritiya Chaitra)',   [('vishnu', 0.10)]),
    ( 3, 'Varaha Jayanti (Shukla Tritiya Bhadrapada)',[('vishnu', 0.10)]),
    ( 6, 'Balarama Jayanti',                           [('vishnu', 0.10)]),
    ( 8, 'Krishna Janmashtami (pan-Hindu)',            [('vishnu', 0.15)]),
    ( 9, 'Ram Navami (pan-Hindu)',                     [('vishnu', 0.15)]),
    (11, 'Monthly Ekadashi (systemic recurrence)',     [('vishnu', 0.20)]),
    (11, 'Vaikuntha Ekadashi (pan-Hindu)',             [('vishnu', 0.15)]),
    (12, 'Vamana Jayanti (Shukla Dwadashi Bhadrapada)',[('vishnu', 0.10)]),
    (12, 'Tulsi Vivaha (Shukla Dwadashi Kartika)',     [('vishnu', 0.10)]),
    (14, 'Narasimha Jayanti (Shukla Chaturdashi Vaishakha)', [('vishnu', 0.10)]),
    (15, 'Buddha Purnima / Vaishakha Purnima (pan-Hindu)',   [('vishnu', 0.15)]),
    (15, 'Kurma Jayanti (Vaishakha Purnima)',          [('vishnu', 0.10)]),
    (15, 'Hanuman Jayanti (Chaitra Purnima, cross-stream)',
        [('vishnu', 0.075), ('shiva', 0.075)]),
    # ----- Shiva stream -----
    (13, 'Pradosh Vrat (every Trayodashi, systemic)',  [('shiva', 0.20)]),
    (14, 'Maha Shivratri (pan-Hindu)',                 [('shiva', 0.15)]),
    (14, 'Masik Shivratri (every Krishna Chaturdashi, systemic)',
        [('shiva', 0.20)]),
    (15, 'Tripurari Purnima / Kartik Purnima',         [('shiva', 0.10)]),
    (15, 'Mahalaya Amavasya / Pitr Paksha',            [('shiva', 0.10)]),
    # ----- Shakti stream -----
    ( 3, 'Hartalika Teej / Gauri Tritiya',             [('shakti', 0.10)]),
    ( 4, 'Ganesh Chaturthi',                           [('shakti', 0.10)]),
    ( 5, 'Vasant Panchami / Saraswati Puja',           [('shakti', 0.10)]),
    ( 5, 'Naga Panchami',                              [('shakti', 0.10)]),
    ( 5, 'Lalita Panchami',                            [('shakti', 0.10)]),
    ( 6, 'Skanda Shashthi',                            [('shakti', 0.10)]),
    ( 8, 'Durga Ashtami',                              [('shakti', 0.10)]),
    ( 8, 'Radhashtami (cross-stream)',
        [('vishnu', 0.05), ('shakti', 0.05)]),
    ( 9, 'Maha Navami (Sharad Navaratri)',             [('shakti', 0.10)]),
    ( 9, 'Sita Navami (cross-stream)',
        [('vishnu', 0.05), ('shakti', 0.05)]),
    (15, 'Sharad Purnima / Kojagari Lakshmi (cross-stream)',
        [('vishnu', 0.05), ('shakti', 0.05)]),
]


def base_from_narada():
    """Return {tithi_num: {stream: weight}} from Narada Purana paksha pair.

    Each paksha contributes 0.5 to its deity's folded stream.
    """
    base = {}
    for num, name, sd, kd in NARADA:
        scores = {s: 0.0 for s in STREAMS}
        for fold in (FOLD[sd], FOLD[kd]):
            for stream, weight in fold.items():
                scores[stream] += 0.5 * weight
        base[num] = scores
    return base


def apply_jayantis(base):
    """Add Jayanti contributions onto base scores."""
    scores = {n: dict(s) for n, s in base.items()}
    for num, label, contribs in JAYANTIS:
        for stream, weight in contribs:
            scores[num][stream] += weight
    return scores


def normalize(scores, floor=0.05, cap=0.85):
    """Apply floor, normalize to sum 1.0, then cap (redistribute excess)."""
    out = {}
    for num, s in scores.items():
        s = dict(s)
        for k in s:
            if s[k] < floor:
                s[k] = floor
        total = sum(s.values())
        s = {k: v / total for k, v in s.items()}
        for k in list(s):
            if s[k] > cap:
                excess = s[k] - cap
                s[k] = cap
                others = {kk: vv for kk, vv in s.items() if kk != k}
                other_sum = sum(others.values())
                if other_sum > 0:
                    for kk in others:
                        s[kk] += excess * (others[kk] / other_sum)
                else:
                    for kk in others:
                        s[kk] += excess / len(others)
        out[num] = s
    return out


def jayantis_for(num):
    return [label for n, label, _ in JAYANTIS if n == num]


def write_csv(narada_rows, scores, path=CSV_PATH):
    fields = [
        'tithi_num', 'tithi_name', 'shukla_deity', 'krishna_deity',
        'jayantis', 'shiva', 'shakti', 'vishnu', 'dominant',
    ]
    with open(path, 'w', newline='') as f:
        w = csv.DictWriter(f, fieldnames=fields)
        w.writeheader()
        for num, name, sd, kd in narada_rows:
            s = scores[num]
            dom = max(s, key=s.get).capitalize()
            w.writerow({
                'tithi_num': num,
                'tithi_name': name,
                'shukla_deity': sd,
                'krishna_deity': kd,
                'jayantis': '; '.join(jayantis_for(num)),
                'shiva':  f'{s["shiva"]:.4f}',
                'shakti': f'{s["shakti"]:.4f}',
                'vishnu': f'{s["vishnu"]:.4f}',
                'dominant': dom,
            })
    print(f'wrote {path}')


def plot(narada_rows, scores, out_path=PNG_PATH):
    n = len(narada_rows)
    names = [r[1] for r in narada_rows]

    fig = plt.figure(figsize=(16, 9), facecolor='white')
    gs = fig.add_gridspec(1, 2, width_ratios=[1.0, 1.0], wspace=0.30)

    # Polar wheel
    ax1 = fig.add_subplot(gs[0, 0], projection='polar')
    ax1.set_theta_zero_location('N')
    ax1.set_theta_direction(-1)
    angles = np.linspace(0, 2 * math.pi, n, endpoint=False)
    width = 2 * math.pi / n * 0.92

    for angle, (num, name, _, _) in zip(angles, narada_rows):
        s = scores[num]
        dom = max(s, key=s.get)
        radius = s[dom]
        ax1.bar(angle, radius, width=width,
                color=STREAM_COLORS[dom], edgecolor='white', linewidth=1.5,
                alpha=0.88)
        ax1.text(angle, 1.10, name,
                 ha='center', va='center', fontsize=9, rotation=0)

    ax1.set_ylim(0, 1.0)
    ax1.set_yticks([0.25, 0.5, 0.75])
    ax1.set_yticklabels(['0.25', '0.50', '0.75'], color='#888', fontsize=7)
    ax1.set_xticks([])
    ax1.set_title('Lunar Wheel of Devotion\n(dominant stream per tithi)',
                  fontsize=13, pad=22)

    # Stacked bar
    ax2 = fig.add_subplot(gs[0, 1])
    shiva  = np.array([scores[r[0]]['shiva']  for r in narada_rows])
    shakti = np.array([scores[r[0]]['shakti'] for r in narada_rows])
    vishnu = np.array([scores[r[0]]['vishnu'] for r in narada_rows])
    y = np.arange(n)

    ax2.barh(y, shiva,  color=STREAM_COLORS['shiva'],  label='Shiva')
    ax2.barh(y, shakti, left=shiva, color=STREAM_COLORS['shakti'], label='Shakti')
    ax2.barh(y, vishnu, left=shiva + shakti, color=STREAM_COLORS['vishnu'], label='Vishnu')
    ax2.set_yticks(y)
    ax2.set_yticklabels(names, fontsize=9)
    ax2.invert_yaxis()
    ax2.set_xlim(0, 1.0)
    ax2.set_xlabel('Devotional lean (proportion)')
    ax2.set_title('Exact Shiva / Shakti / Vishnu split per tithi',
                  fontsize=13, pad=15)
    ax2.legend(loc='lower right', frameon=False, fontsize=9)
    ax2.spines['top'].set_visible(False)
    ax2.spines['right'].set_visible(False)
    ax2.grid(axis='x', alpha=0.2)

    fig.suptitle('Shiva  ·  Shakti  ·  Vishnu  across the 15 tithis',
                 fontsize=15, y=0.99)
    fig.savefig(out_path, dpi=130, bbox_inches='tight', facecolor='white')
    print(f'wrote {out_path}')


def main():
    base = base_from_narada()
    raw = apply_jayantis(base)
    scores = normalize(raw)

    # Sanity: each tithi sums to 1.0
    for num, s in scores.items():
        total = sum(s.values())
        assert abs(total - 1.0) < 1e-6, f'tithi {num}: sum={total}'

    write_csv(NARADA, scores)
    plot(NARADA, scores)


if __name__ == '__main__':
    main()
