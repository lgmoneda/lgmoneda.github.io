---
layout: post
title: "Find yourself a job!"
date: 2018-01-21
lang: en
ref: find-job
description: How to find youself a job using Python and Raspberry Pi.
---

In this post I'm going to show how a well structured HTML, Python and a loyal Raspberry Pi can help you to find a nice position in a company you like.

At the end, you'll be able to receive this kind of message:

<div align="center">
<figure>
	<a href="images/find-job-email-example.png">
		<img  style="width:350px;margin:10px" src="../../../images/find-job-email-example2.png"/>
	</a>
	<figcaption>You should receive an e-mail like that when the script finds what you want</figcaption>
</figure>
</div>

## Overview

1. [Crawling jobs portal](#crawl)
2. [Sending an e-mail](#email)
3. [Configuring RPi to run a script periodically](#rpi)


## Crawling jobs portal <a name="#crawl"> </a>

To crawl a website in Python the suggested way to go is to use Beautiful Soup. To use it, put the <a href="../../../files/BeautifulSoup.py">BeatifulSoup.py</a> at the same folder of your script.

The code below is commented, but what it does is basically: 

1. Get html content from a page
2. Find elements with a certain tag (in our case, the "job" one)
3. Get the elements' text and compare with key-words provided
4. Do it for all urls provided
5. Format the text
6. Send an e-mail when there are desired positions

Name it `job_finder.py`.

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

        ### Retrieve all of the anchor tags
        jobs = soup.findAll("li", { "class" : "job" })

        ### Keep the text of the available positions 
        available_positions = []
        for job in jobs:
                for a_element in job.findAll("a"):
                        available_positions.append(a_element.text)

        warning_email_positions = []

        ### Compare the available positions with all the desired key-words
        for position in available_positions:
                for wanted_position in wanted_positions:
                        if wanted_position.lower() in position.lower():
                                warning_email_positions.append(position)

        ### Make sure there's no duplicated
        warning_email_positions = set(warning_email_positions)

        ### If there are interesting positions, format it
        if len(warning_email_positions) != 0:
                msg = make_msg_from_positions(warning_email_positions, url)
                ### Concatenate to make a single final string
                final_msg += "\n" + msg

### If there are interesting positions, send an email informing it                
if len(final_msg) > 0:
        send_me_msg(final_msg, "Interesting positions Spotted!")


```

## Sending an e-mail <a name="#email"> </a>

To make the above script work we need another one to send an e-mail.

```
from email.mime.text import MIMEText
from datetime import datetime
import base64


def send_me_msg(msg, subject):

	now = datetime.now()
	 
	server = smtplib.SMTP('smtp.gmail.com', 587)	
	server.starttls()
	server.login("your.email@gmail.com", "your_email_password")

	### A list of e-mails to send it, maybe you want to warn some friends!
	REPLY_TO_ADDRESSES = ["your.email@gmail.com", "friend.email@gmail.com"]

	watch = now.strftime("%H:%M")
	
	### Just a custom message
	msg = MIMEText("Hi, Moneda, how things are going? It's " + watch + "\n\n" + msg )
	msg["Subject"] = subject + " " + str(now.day) + "/" + str(now.month)

	for ADDRESS in REPLY_TO_ADDRESSES:
		msg.add_header('reply-to', ADDRESS)
		server.sendmail("your.email@gmail.com", ADDRESS, msg.as_string())
	server.quit()


if __name__ == "__main__":
        pass
```

You need to enable less segure login in your Gmail account. For that, use this <a href="https://stackoverflow.com/questions/10147455/how-to-send-an-email-with-gmail-as-provider-using-python">Gmail's settings page.</a>.

## Configuring RPi to run a script periodically <a name="#rpi"> </a>

From the scratch:

1. Download the OS from [Raspberry Pi Website](www.raspberrypi.org)
2. Write the image in the SD card (I've used Etcher in MAC OS)
3. Enable ssh: `sudo raspi-config` -> `Interfacing Options` -> `SSH`
4. Connect it to your network via ethernet cable or Wi-Fi
5. Use the `ifconfig` command to check your pi's network address, it's the `inet` field.

Now you can ssh your pi. Use the address you've checked using `ifconfig`. My pi address in my network is `192.168.1.130`, replace it by yours and do `ssh pi@182.168.1.130`.

Then you need to transfer the files you've tested locally to the pi:

1. Create a folder with `mkdir job_finder` using ssh;
2. From your regular computer and at the scripts folder, do `scp job_finder.py pi@192.168.1.130:/home/pi/job_finder`, `scp job_finder.py pi@192.168.1.130:/home/pi/job_finder`.

You can test if the script work at your Raspberry Pi doing `python job_finder.py`. It should work just out-of-box.

Ok, now we need to make the Raspberry call this script periodically. For this, we're going to use crontab, a linux tool to schedule commands.

```
sudo crontab -e
```

Scroll down and insert a new line:

```
0 0 * * * python /home/pi/job_finder/job_finder.py
```

Basically, the 5 arguments before the command you want to schedule are to define the minute, hour, day of the month, month and day of week (5 = Friday). When you use asterisk you're saying you want it to run every time for that field. Here we've schedule it to run everyday, so it runs at 0 minute of the 0 hour every day of every month.

If you want a more extensive guide about crontab, I suggested <a href="http://kvz.io/blog/2007/07/29/schedule-tasks-on-linux-using-crontab/">this post</a>.



