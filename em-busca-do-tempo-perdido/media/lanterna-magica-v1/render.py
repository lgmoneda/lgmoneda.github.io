#!/usr/bin/env python3
"""Render a 12-second lantern loop from generated stills using FFmpeg."""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent
FPS = 24
DURATION = 12
WIDTH, HEIGHT = 1280, 720

def run(args):
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'warning', '-y', *args], check=True)

with tempfile.TemporaryDirectory(prefix='proust-lantern-') as temporary:
    work = Path(temporary)
    # Fixed optical deformation: door-frame relief, rounded knob and curtain folds.
    xmap = "128+if(between(X,906,928),3,0)+if(gt(X,1184),5*sin((X-1184)/7),0)+7*(X-960)/16*exp(-((X-960)*(X-960)+(Y-324)*(Y-324))/180)"
    ymap = "128+if(gt(X,1184),2*cos((X-1184)/7),0)+5*(Y-324)/16*exp(-((X-960)*(X-960)+(Y-324)*(Y-324))/180)"
    for name, expression in [('xmap', xmap), ('ymap', ymap)]:
        run(['-f', 'lavfi', '-i', f"nullsrc=s={WIDTH}x{HEIGHT},geq=lum='{expression}':cb=128:cr=128,format=gray", '-frames:v', '1', '-update', '1', str(work / f'{name}.png')])
    graph = f"""
[0:v]scale={WIDTH}:{HEIGHT},setsar=1,format=gbrp,eq=brightness=-0.025:saturation=0.88,format=gbrp[room];
[1:v]scale=850:460,format=rgba,colorchannelmixer=rr=0.58:gg=0.58:bb=0.58, gblur=sigma=0.65[slide];
[2:v]scale=250:250,format=rgba,colorkey=0x000000:0.045:0.025,
fade=t=in:st=0.35:d=1.0:alpha=1,fade=t=out:st=10.0:d=1.65:alpha=1[golo];
[3:v][slide]overlay=x='380+2*sin(2*PI*t/12)':y='65+1.5*sin(2*PI*t*3/12)':format=rgb[landscape];
[landscape][golo]overlay=x='490+36*t+2.5*sin(2*PI*t*15/12)':y='210-2.8*abs(sin(2*PI*t*15/12))':format=rgb,format=gbrp[projection];
[projection][4:v][5:v]displace=edge=blank,gblur=sigma=0.85,format=gbrp[optics];
[room][optics]blend=all_expr='A+(255-A)*(B/255)*(0.48+0.40*A/255)*(0.96+0.025*sin(2*PI*T*43/12)+0.025*sin(2*PI*T*7/12))':shortest=1,
eq=brightness='0.0025*sin(2*PI*t*43/12)+0.0018*sin(2*PI*t*7/12)':eval=frame,
format=yuv420p[film]
""".replace('\n', '')
    args=[]
    for name in ['bedroom.png', 'glass-slide.png', 'golo.png']:
        args += ['-loop', '1', '-framerate', str(FPS), '-i', str(ROOT/name)]
    args += ['-f','lavfi','-i',f'color=c=black:s={WIDTH}x{HEIGHT}:r={FPS}:d={DURATION}']
    for name in ['xmap','ymap']:
        args += ['-loop','1','-framerate',str(FPS),'-i',str(work/f'{name}.png')]
    args += ['-filter_complex_threads','4','-filter_complex',graph,'-map','[film]',
             '-t',str(DURATION),'-r',str(FPS),'-an','-c:v','libx264','-preset','slow','-crf','18',
             '-movflags','+faststart','-metadata','title=A lanterna mágica — Combray',str(ROOT/'lanterna-magica.mp4')]
    run(args)
    run(['-ss','6','-i',str(ROOT/'lanterna-magica.mp4'),'-frames:v','1','-q:v','2','-update','1',str(ROOT/'poster.jpg')])
print(ROOT/'lanterna-magica.mp4')
