# OKGD-preparing-for-multiplayer
[Aug 6th Presentation for Oklahoma Game Developers meetup](http://www.meetup.com/Oklahoma-Game-Developers/events/224288063/)

The included files are seperated into two parts: demos and slides.


Running the Slides
==================
All you need to view the slides is a web server. A simple app like [Fenix Web Server](http://fenixwebserver.com/) will host the files where they are viewable. Running at the local file:// works with a few minor quirks.

Running the Demos
=================
You need nw.js and node installed for the client and server respectively. The code was tested and runs on Node.js 0.12.7. Be sure to run `npm install` on both the client and server before running.

Honorable Mentions & Links:
--------------------------

**Libraries**
- [RakNet](http://www.jenkinssoftware.com/raknet/manual/connecting.html)
- [Netty](http://netty.io/)
- [Pomelo](http://pomelo.netease.com/)
- [Proco](http://pocoproject.org/index.html)
- [Ice [licensed]](https://zeroc.com/overview.html)
- [More Details](http://www.codeofhonor.com/blog/choosing-a-game-network-lib)

**Resources/Articles**

- [64 Network DO’s and DON’Ts for Game Engine Developers](http://ithare.com/64-network-dos-and-donts-for-game-engine-developers-part-i-client-side/)
- [Networking for Game Programmers](http://gafferongames.com/networking-for-game-programmers/)
- [Source Multiplayer Networking](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization])
-[Latency Compensation](https://developer.valvesoftware.com/wiki/Latency_Compensating_Methods_in_Client/Server_In-game_Protocol_Design_and_Optimization)
- [How to make a multi-player game](http://www.wildbunny.co.uk/blog/2012/10/09/how-to-make-a-multi-player-game-part-1/)

Known Issues
------------
The UDP client test does not unbind the socket which may present ADDRESS_IN_USE errors.
