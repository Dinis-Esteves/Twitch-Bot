import subprocess
from pathlib import Path



# Cria um objeto que representa o caminho da pasta scripts
scripts_dir = Path("sources")

# Obtém o caminho absoluto da pasta scripts
scripts_dir = scripts_dir.absolute()

# Inicia o processo do comando python Bot_py.py
bot_process = subprocess.Popen(["cmd", "/k", "python", str(scripts_dir / "Bot_py.py")])

# Inicia o processo do comando python server.py
server_process = subprocess.Popen(["python", str(scripts_dir / "server.py")])

# Espera os processos terminarem
bot_process.wait()
server_process.wait()
