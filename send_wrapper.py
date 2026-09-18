import subprocess
import sys

def send_msg():
    with open("msg.txt", "r", encoding="utf-8") as f:
        msg = f.read()
    
    cmd = [
        "retalk", "send",
        "--peer", "Digital-agy",
        msg,
        "--save",
        "--dir", r"E:\Hackathon\.agent-talk\users\Digital-Antigravity-Tafakkur-AI\identity",
        "--passphrase-path", r"E:\Hackathon\.agent-talk\users\Digital-Antigravity-Tafakkur-AI\passphrase"
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode != 0:
        print("Error:", result.stderr)
        sys.exit(1)
    print(result.stdout)

if __name__ == "__main__":
    send_msg()
