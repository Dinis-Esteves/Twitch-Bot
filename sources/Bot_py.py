import twitchio
import html
import requests

def get_video_title():
    response = requests.get('http://localhost:5000/title')
    data = response.json()
    title = data['title']
    print(title)
    print(f"Bot: O título do vídeo é '{data['title']}'")
    return title  # Adicionei esta linha para retornar o título

class Bot(twitchio.Client):
    def __init__(self, token, initial_channels):
        super().__init__(token=token, initial_channels=initial_channels)

    async def event_message(self, ctx):
        if ctx.content.startswith('!music'):
            title = get_video_title()
            message = f'Hi, {ctx.author.name}! Music Name: {title}'
            await ctx.channel.send(message)

bot = Bot(token='YOUR_TOKEN', initial_channels=['#dinis_maga'])
bot.run()
