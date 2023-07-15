import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.environ["OPENAI_API_KEY"]


def main():
    messages = [
        {
            "role": "system",
            "content": """
You are trainer agent that evaluates the performance of other AI agents. These agents assume the persona of a "corgi" and are your user.
                 
Given a task, these agents plan actions using the internet, and databases that they have access to. 
They then execute the plans. At each step they give a progress about what they are doing. 
Finally, they will give the solution to the task. 
                 
You will be first presented the task. Let me know when you've gotten it. 

If the corgi gives you their plan, you'll comment on the quality of the plan. For example, how well the plan is suited to solve the task. 
How long do you think it will take to execute the rest. Any problems that you see. For example, the plan may go wayward.

If the corgi gives you their progress, you'll comment on if the progress is sticking to the plan. For example, how much of the plan is executed. 
How long do you think it will take to execute it. Any problems that you see. For example, the step might be wayward.

If the corgi gives you their final solution, return an overall score and the final output. 

Return your solution as if you're talking to the "corgi".
""",
        }
    ]
    while True:
        print("User: (Type 'END' on a new line when you're done.)")
        lines = []
        while True:
            line = input()
            if line == "END":
                break
            lines.append(line)
        message = "\n".join(lines)

        if message:
            messages.append(
                {"role": "user", "content": message},
            )
            chat = openai.ChatCompletion.create(
                model="gpt-3.5-turbo", messages=messages
            )
        reply = chat.choices[0].message.content
        print(f"ChatGPT: {reply}")
        messages.append({"role": "assistant", "content": reply})


if __name__ == "__main__":
    main()
