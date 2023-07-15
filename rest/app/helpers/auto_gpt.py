import subprocess
import threading
import queue
import os
from time import sleep


class ShellScriptThread(threading.Thread):
    def __init__(self, script_path, script_folder, callback):
        threading.Thread.__init__(self)
        self.script_path = script_path
        self.script_folder = script_folder
        self.callback = callback
        self.output_queue = queue.Queue()
        self.daemon = True  # Ensures the thread exits when main program does.

    def run(self):
        self.process = subprocess.Popen(
            ["sh", self.script_path],
            cwd=self.script_folder,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
        )

        while True:
            output = self.process.stdout.readline()
            if output == b"" and self.process.poll() is not None:
                break
            if output:
                self.output_queue.put(output.strip())
        rc = self.process.poll()

        # Now handle stderr
        for line in self.process.stderr:
            self.output_queue.put(line.strip())

        return rc

    def send_input(self, input_data):
        if self.process:
            self.process.stdin.write(f"{input_data}\n".encode())
            self.process.stdin.flush()

    def get_output(self):
        while not self.output_queue.empty():
            self.callback(self.output_queue.get().decode())


class ConvState:
    def __init__(self):
        self.started = False
        self.waiting_for_user = False
        self.buffered = ""
        self.speak = ""

    def flush(self):
        self.buffered = ""

    def my_callback(self, output):
        if self.started:
            if "Asking user via keyboard..." in output.strip():
                self.waiting_for_user = True
            else:
                print(".")
                self.waiting_for_user = False
                if output.strip():
                    self.buffered += output.strip() + "\n"
                if "SPEAK:" in output.strip():
                    self.speak = output.strip()
                    self.buffered = ""
                else:
                    self.speak = ""
        elif (
            "Create an AI-Assistant:  input '--manual' to enter manual mode."
            in output.strip()
        ) or "Welcome back!" in output.strip():
            self.started = True


def launch_auto_gpt():
    conv_state = ConvState()
    # specify the script folder
    script_folder = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "Auto-GPT"
    )
    # specify the script_path relative to the script_folder
    script_path = "run.sh"

    shell_thread = ShellScriptThread(script_path, script_folder, conv_state.my_callback)
    shell_thread.start()

    try:
        # periodically check and retrieve output
        while shell_thread.is_alive():
            shell_thread.get_output()
            if not conv_state.waiting_for_user:
                sleep(0.01)
                continue
            if conv_state.speak:
                print(conv_state.speak)
            else:
                print(conv_state.buffered)
            user_input = input("!")
            if user_input.lower() == "exit":
                print("Exiting...")
                break
            print(f"YOU: {user_input}")
            conv_state.flush()
            shell_thread.send_input(user_input)
            # periodically check and retrieve output
            while shell_thread.is_alive():
                shell_thread.get_output()
    except KeyboardInterrupt:
        print("\nExiting due to keyboard interrupt")

    # get any remaining output after process termination
    shell_thread.get_output()


if __name__ == "__main__":
    launch_auto_gpt()
