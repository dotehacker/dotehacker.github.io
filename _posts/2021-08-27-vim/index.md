---
title: "VIM"
date: 2021-08-27
category: "Engineering"
tags: [vim, text editor, terminal, linux, productivity]
---

![vim.png](https://fatosmorina.com/wp-content/uploads/2017/06/vim.png)

IT IS MODAL EDITOR (DIFFERENT OPERATING MODES)

- Normal mode (navigating around file)
  - `i` — Insert mode (press `esc` to return)
  - `r` — Replace mode (press `esc` to return)
  - `v` — Visual mode (press `esc` to return)
    - Line mode (keyboard control)
    - Block mode (mouse control)

## Commands

> Normal mode

| Command | Description |
| --- | --- |
| `:q` | Quit a window |
| `:q!` | Quit entire vim |
| `:w` | Save file |
| `:w *.txt` | Save as new file |
| `/words` | Search for words in file |
| `n` | Select next match of pattern |
| `.` | Repeat the same editing |
| `ci` | Edit words inside parentheses |

---

| Command | Description |
| --- | --- |
| `h` | Move cursor left |
| `l` | Move cursor right |
| `j` | Move cursor down |
| `k` | Move cursor up |
| `u` | Undo the change |
| `y` | Copy a character |
| `yw` | Copy a word |
| `p` | Paste |
| `v` | Enable visual mode for text selection |
| `o` | Open a new line for editing |

---

| Command | Description |
| --- | --- |
| `b` | Move cursor back one word |
| `G` | Move to end of file |
| `g` | Move to beginning of file |
| `dw` | Delete a word |
| `ce` | Delete word and enter insert mode |
| `x` | Delete a character |
| `r` | Replace a character |

> Insert mode

To move from **Normal** mode to **Insert** mode you can do the following:

1. Press `s`
2. Press `i`
3. Press `gh`

To escape back to normal mode use the `Esc` key.
