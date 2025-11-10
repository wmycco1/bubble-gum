#!/bin/bash

# БЕЗОПАСНЫЕ ALIASES для управления dev сервером Bubble Gum
# Добавь эти строки в ~/.bashrc или ~/.zshrc
# Версия: 1.0.0
# Дата: November 10, 2025

# ==============================================================================
# КОПИРУЙ ЭТИ СТРОКИ В ~/.bashrc
# ==============================================================================

# Безопасное убийство dev сервера (по портам)
alias kill-dev='lsof -ti:3000,3010 2>/dev/null | xargs -r kill -9 2>/dev/null && pkill -9 -f "next-server" 2>/dev/null && pkill -9 -f "turbopack" 2>/dev/null && sleep 2 && echo "✅ Dev server killed safely"'

# Полная очистка для Bubble Gum
alias kill-bg='lsof -ti:3000,3010 2>/dev/null | xargs -r kill -9 2>/dev/null && pkill -9 -f "bubble-gum.*next" 2>/dev/null && rm -rf .next && sleep 2 && echo "✅ Bubble Gum dev killed + cache cleared"'

# Быстрый рестарт
alias restart-dev='kill-dev && npm run dev'
alias restart-bg='kill-bg && npm run dev'

# Перейти в директорию проекта
alias cd-bg='cd /var/www/bubble-gum'

# Полный workflow: перейти → убить → очистить → запустить
alias start-bg='cd /var/www/bubble-gum && kill-bg && npm run dev'

# ==============================================================================
# ИНСТРУКЦИЯ ПО УСТАНОВКЕ
# ==============================================================================

# 1. Скопируй строки выше (от "alias kill-dev" до "alias start-bg")
# 2. Открой ~/.bashrc в редакторе:
#    nano ~/.bashrc
# 3. Вставь скопированные строки в конец файла
# 4. Сохрани файл (Ctrl+O, Enter, Ctrl+X в nano)
# 5. Перезагрузи конфигурацию:
#    source ~/.bashrc
# 6. Готово! Теперь можешь использовать:
#    kill-bg      # Убить dev сервер + очистить кэш
#    restart-bg   # Рестарт одной командой
#    start-bg     # Перейти в проект + запустить

# ==============================================================================
# ИСПОЛЬЗОВАНИЕ
# ==============================================================================

# kill-dev         # Убить dev сервер (любого проекта)
# kill-bg          # Убить + очистить кэш для Bubble Gum
# restart-dev      # Рестарт dev сервера
# restart-bg       # Рестарт Bubble Gum
# cd-bg            # Перейти в проект
# start-bg         # Полный workflow (перейти → убить → запустить)
