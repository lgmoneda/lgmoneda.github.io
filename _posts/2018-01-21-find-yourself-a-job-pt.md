---
layout: post
title: "Encontrando uma vaga de trabalho!"
date: 2018-01-21
lang: pt
ref: find-job
description: Como encontrar um trabalho legal utilizando Python e um Raspberry Pi.
author: moneda
---

Neste post irei mostrar como um HTML bem estruturado, Python e um leal Raspberry Pi podem ajudar na hora de encontrar aquela vaga legal em uma empresa que você gosta.  

Ao final, você será capaz de receber em seu e-mail uma mensagem assim: 

<div align="center">
<figure>
	<a href="images/find-job-email-example.png">
		<img  style="width:350px;margin:10px" src="../../../images/find-job-email-example2.png"/>
	</a>
	<figcaption>Você receberá uma mensagem de e-mail quando o script encontrar a vaga que você deseja em uma das empresas listadas. </figcaption>
</figure>
</div>

## Overview

1. [Fazendo um Crawling no portal de vagas "Workable"](#crawl)
2. [Enviando um e-mail usando Python](#email)
3. [Configurando um RPi para rodar um script periodicamente](#rpi)


## Fazendo um Crawling no portal de vagas "Workable" <a name="#crawl"> </a>

Para fazer crawl em um site usando Python o sugerido é utilizar a biblioteca BeautifulSoup. Para usá-la, coloque o arquivo <a href="../../../files/BeautifulSoup.py">BeatifulSoup.py</a> na mesma pasta que estiver o seu script. 

O código abaixo está comentado, mas dando uma idéia geral da abordagem: 

1. Pegue o conteúdo do html da página
2. Encontra os elementos com a tag "job" 
3. Pega o texto desses elementos e compara com as key-words fornecidas
4. Repete-se 1 até 3 para todas as url de cada empresa
5. Formata-se o texto
6. Um e-mail é enviado utilizando o texto gerado, caso haja vagas de interesse

Dê o nome para esse arquivo de `job_finder.py`.

```python
#encoding='utf-8'
unicode("utf-8")
import urllib
from BeautifulSoup import *
from datetime import datetime
from send_me_msg import send_me_msg

def make_msg_from_positions(warning_email_positions, url):
        """
        Format a text block with the url and all the interesting
        positions from it.
        """
        msg = "Positions from " + url + ": \n"
        for i, position in enumerate(warning_email_positions):
                msg += str(i+1) + ") " + position + "\n"
                
        return msg

wanted_positions = ["Data Scientist",
                    "Machine",
                    "Data",
                    "Intelligence",
                    "Software"]

urls_list = ["https://nubank.workable.com/",
             "https://eduk.workable.com/", 
             "https://brandbastion.workable.com/"]


final_msg = ""
for url in urls_list:
        html = urllib.urlopen(url).read()
        soup = BeautifulSoup(html)

        ### Retorna todas os elementos li que são da classe job 
        jobs = soup.findAll("li", { "class" : "job" })

        ### Extrai o texto dos li - as posições disponíveis
        available_positions = []
        for job in jobs:
                for a_element in job.findAll("a"):
                        available_positions.append(a_element.text)

        warning_email_positions = []

        ### Compara as posições com as palavras-chave da list wanted_positions 
        for position in available_positions:
                for wanted_position in wanted_positions:
                        if wanted_position.lower() in position.lower():
                                warning_email_positions.append(position)

        ### Só para garantir que não teremos duplicações 
        warning_email_positions = set(warning_email_positions)

        ### Se tiver alguma posição de interesse, formata o texto 
        if len(warning_email_positions) != 0:
                msg = make_msg_from_positions(warning_email_positions, url)
                ### Concatena para gerar uma mensagem final 
                final_msg += "\n" + msg

### Se tem alguma posição de interesse em alguma empresa listada, envia o e-mail 
if len(final_msg) > 0:
        send_me_msg(final_msg, "Interesting positions Spotted!")


```

## Enviando um e-mail usando Python <a name="#email"> </a>

Para que o script acima funcione até o final, precisamos da função para enviar o e-mail: 

```
from email.mime.text import MIMEText
from datetime import datetime
import base64


def send_me_msg(msg, subject):

	now = datetime.now()
	 
	server = smtplib.SMTP('smtp.gmail.com', 587)	
	server.starttls()
	server.login("your.email@gmail.com", "your_email_password")

	### Uma lista com e-mails para enviar a mensagem, talvez alguns amigos também queiram receber o aviso:
	REPLY_TO_ADDRESSES = ["your.email@gmail.com", "friend.email@gmail.com"]

	watch = now.strftime("%H:%M")
	
	### Uma mensagem customizada para começar o e-mail
	msg = MIMEText("Hi, Moneda, how things are going? It's " + watch + "\n\n" + msg )
	msg["Subject"] = subject + " " + str(now.day) + "/" + str(now.month)

	for ADDRESS in REPLY_TO_ADDRESSES:
		msg.add_header('reply-to', ADDRESS)
		server.sendmail("your.email@gmail.com", ADDRESS, msg.as_string())
	server.quit()


if __name__ == "__main__":
        pass
```

Para que isso funcione, é preciso liberar o login por vias menos seguras, você faz isso através do Gmail <a href="https://stackoverflow.com/questions/10147455/how-to-send-an-email-with-gmail-as-provider-using-python">aqui</a>.

## Configurando um RPi para rodar um script periodicamente <a name="#rpi"> </a>

Começando do zero: 

1. Faça o download do sistema operacional em [Raspberry Pi Website](www.raspberrypi.org)
2. Escreva a imagem do SO em um cartão SD (Eu usei o Etcher para fazer isso no Mac OS) 
3. Habilite o ssh, digite no terminal do RPi: `sudo raspi-config` -> `Interfacing Options` -> `SSH`
4. Conecte o RPi a internet usando um cabo ethernet ou configurando o wiki com `sudo raspi-config` 
5. Use o `ifconfig` para verificar qual é o endereço do RPi na sua rede local, ele estará no campo `inet` 

Agora você conseguirá se comunicar com o seu RPi usando ssh. Use o endereço que você pegou usando o `ifconfig`. O endereço do meu RPi na minha rede é `192.168.1.130`, substitua pelo o seu nos comando `ssh pi@182.168.1.130`.

Então é preciso transferir os arquivos. Você deve ter testado eles locamente e com `python job_finder.py` e ter verificado o seu funcionamento. Agora no RPi:

1. Crie a pasta para o script com `mkdir job_finder` após conectar-se no RPi com o ssh;
2. Do terminal do seu computador, faça `scp job_finder.py pi@192.168.1.130:/home/pi/job_finder`, `scp job_finder.py pi@192.168.1.130:/home/pi/job_finder`.

Você agora pode testar se o script funciona também no RPi usando `python job_finder.py`. Ele deverá funcionar sem qualquer instalação adicional.

Ok, agora nós precisamos que o RPi execute o script periodicamente. Para isso, usaremos o crontab, uma ferramenta de SOs com base Linux utilizada para agenda a execução de comandos. No terminal do RPi:

```
sudo crontab -e
```

Vá até o final do arquivo e adicione a seguinte linha:

```
0 0 * * * python /home/pi/job_finder/job_finder.py
```

Baiscamente, os 5 argumentos antes do comando que você quer agendar são para definir o minut, hora, dia do mês, mês e dia da semana (5 = Sexta-Feira) que você quer que seja executado. Quando é utilizado um asterisco estamos definindo que o comando deve ser executado para cada passagem daquele item (todo minuto, toda hora, todo dia...). Neste exemplo, nós agendamos para rodar todos os dias de todos os meses no minuto 0 e hora 0 do dia. 

Se você quiser um guia mais completo para configurar o crontab, eu sugiro a leitura do <a href="http://kvz.io/blog/2007/07/29/schedule-tasks-on-linux-using-crontab/">post</a>.



