张建毅 -  说: (2013-08-13 16:52:45)
flashVars:{}
张建毅 -  说: (2013-08-13 16:58:20)
      flashVars:{
        src:''//音频URL
        }
      
      控制方法：
       load();//加载音频
       play();//播放音频
       pause();//暂停
       setSrc(url:String);//设置音频URL
       seek(pos:Number);//设置音频播放时间头
       setVolume(vol:Number);//设置音量
张建毅 -  说: (2013-08-13 16:59:30)
因为是播放音频，flashVars的有些参数默认就是针对音频播放的，所以无须设置，只设置src就可以了
==
