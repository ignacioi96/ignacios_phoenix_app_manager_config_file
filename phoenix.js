// Info at: https://github.com/kasper/phoenix/
//
// TODO add functionality to adjust other screens when resizing one


// input: a window (expects it is the currently focused window)
// output: an array of all the window's that are currently
//			bordering with given window (neighbours)
// effect: finds all neighbours of the given window and returns an array with them
function findNeighbours(focus_window) {
	var windows = focus_window.others();
	var winLen = windows.length;
	var neighbours = [];
	var currwin = windows[0];
	for(i = 0; i < winLen; i++) {
		currwin = windows[i];
		if((currwin.topLeft().x+currwin.size().width)==focus_window.topLeft().x) {
			neighbours.push(currwin);
		}
	}
	notifier("Neighbours found: " + neighbours.length);
	return neighbours;
}

// input: a window (expects it is the window in focus right now)
// output: none
// effect: makes the neighbours of the current window larger
//			as the focused window becomes smaller
function resizeNeighbours(focus_window) {
	var neighbours = findNeighbours(focus_window);
	for(i = 0; i < neighbours.length; i++) {
		neighbours[i].setFrame({
			x: neighbours[i].topLeft().x,
			y: neighbours[i].topLeft().y,
			width: neighbours[i].size().width + 10,
			height: neighbours[i].size().height
		});
	}
}

// input: a string or error mesage
// output: none
// effect: calls Phoenix's notify function to display the given message/string
function notifier(message) {
	Phoenix.notify(message);
}

// input: a window and a string -specifies a side
// output: none
// effect: places the window in either left or right half
//          of the screen specified by the given string.
//          Else tells the user that the string is not
//          recognized.
function verticalizeAndHalf(window, side) {
	screen = Screen.main().flippedVisibleFrame();
	if(side == 'right') {
		window.setFrame({
		          x: screen.width/2, 
		          y: 0.0, 
		          width: screen.width/2, 
		          height: screen.height
        });
	} else if(side == 'left') {
		window.setFrame({
          x: 0.0, 
          y: 0.0, 
          width: screen.width/2, 
          height: screen.height
        });
	} else {
		notifier('Do not recognize screen side: ' + side);
	}
}

// input: a window and a string -specifies a side
// output: none
// effect: places the window in either upper or lower half
//          of the screen specified by the given string.
//          Else tells the user that the string is not
//           recognized.
function horizontalizeAndHalf(window, side) {
  notifier('Horizontal ' + side);
	screen = Screen.main().flippedVisibleFrame();
	if(side == 'up') {
		window.setFrame({
			x: window.topLeft().x,
			y: 0.0, 
			width: window.size().width,
			height: screen.height/2
        });
	} else if(side == 'down') {
		window.setFrame({
			x: window.topLeft().x,
			y: window.topLeft().y + window.size().height/2,
			width: window.size().width,
			height: window.size().height/2
		});
	} else {
		notifier('Do not recognize screen side: ' + side);
	}
}

// input: a number (in seconds)
// output: none
// effect: sets a timer for the specified time in seconds
//          when the time is up it notifies the user.
function timer(seconds) {
	var secs = seconds;
	var timer = Timer.after(secs, notifier('Time for a break.'));
	notifier('Countdown: ' + parseFloat(secs) + ' seconds.');
	Timer.off(timer);
}

// input: a window, and a number
// output: none
// effect: helper function for tiling the windows in the
//          screen. If the counter is 1 then the window
//          is placed in the upper left fourth of the screen
//          else it is placed in lower left fourth      
function tilerHelper(win, counter) {
 	if(counter == 1) {
 		verticalizeAndHalf(win, 'left');
 		horizontalizeAndHalf(win, 'up');
 	} else {
 		verticalizeAndHalf(win, 'left');
 		horizontalizeAndHalf(win, 'down');
  }
}

// input: a window (assumes it is the focused window)
// output: none
// effect: places the focused window in the right half
//          of the screen. Places the rest of the windows
//          in the upper and lower left fourths of the
//          screen depending on the counter passed to
//          the tiler helper function
function tile3Windows(focus_window) {
	var counter = 0;
  // screen = Screen.main().flippedVisibleFrame();
  var windows = focus_window.others();
  var max = windows.length;
  notifier(max);
  var win = windows[0];
  var i;
  verticalizeAndHalf(focus_window, 'right');
  for(i = 0; i < max; i++) {
    win = windows[i];
    if(win.isVisible() && (win !== focus_window)) {
      tilerHelper(win, counter);
      counter++;
    }
  }
} 


// centers the focused window in the screen, if something goes wrong throughs an error
try {
    Key.on('c', [ 'cmd', 'alt' ], function () {
      var screen = Screen.main().flippedVisibleFrame();
      var window = Window.focused();
      if (window) {
        window.setTopLeft({
          x: screen.x + (screen.width / 2) - (window.frame().width / 2),
          y: screen.y + (screen.height / 2) - (window.frame().height / 2)
        });
      }
    });
} catch(error) {
  notifier("Error with centering configuration.");
  notifier(error);
}

// sets a timer for 30 minutes, if something goes wrong throughs an error
try {
    Key.on('t', [ 'cmd', 'alt' ], function () {
    	timer(30*60);
    });
} catch(error) {
  notifier("Error with Timer configuration.");
  notifier(error);
}

// tiles the open-non-minimized windows by calling tile3Windows
// if something goes wrong throughs an error
try {
    Key.on('y', [ 'cmd', 'alt' ], function () {
    	var screen = Screen.main().flippedVisibleFrame();
	    var window = Window.focused();
    if (window) {
      tile3Windows(window);
    }
  });
} catch(error) {
  notifier("Error with tiler configuration.");
  notifier(error);
}

// full screens the focuse window
// if something goes wrong throughs an error
try{
    Key.on('f', [ 'cmd', 'alt' ], function () {
      var screen = Screen.main().flippedVisibleFrame();
      var window = Window.focused();
      var full = false;
      if (window) {
      	if(!window.isFullScreen()){
        	full = true;
        }
        window.setFullScreen(full);
      }
    });
} catch(error) {
  notifier("Error with full screen configuration.");
  notifier(error);
}

// fills the screen with the focues window (not full screen)
// if something goes wrong throughs an error
try {
    Key.on('l', [ 'cmd', 'alt' ], function () {
      var screen = Screen.main().flippedVisibleFrame();
      var window = Window.focused();
      if (window) {
      	window.setFrame({
          x: 0.0,
          y: 0.0, 
          width: screen.width, 
          height: screen.height
      	});
      }
    });
} catch(error) {
  notifier("Error with large frame configuration.");
  notifier(error);
}


// if something goes wrong throughs an error
try {

// places the focused window on the right half of the screen
// if already there the window's size is shrunk by 10 units
//    while maintaining the upper right corner in the same place
    Key.on('right', [ 'cmd', 'alt' ], function () {
    var screen = Screen.main().flippedVisibleFrame();
    var window = Window.focused();
    if (window) {
      if(window.topLeft().x >= screen.width/2 && window.size().width <= screen.width/2) {
      	resizeNeighbours(window);
        window.setFrame({
          x: window.topLeft().x + 10,
          y: window.topLeft().y,
          width: window.size().width - 10,
          height: window.size().height
        });
      }
      else {      
        verticalizeAndHalf(window, 'right');
      }
    }
  });


// places the focused window on the left half of the screen
// if already there the window's size is shrunk by 10 units
//    while maintaining the upper left corner in the same place
// if something goes wrong throughs an error
  Key.on('left', [ 'cmd', 'alt' ], function () {
    var screen = Screen.main().flippedVisibleFrame();
    var window = Window.focused();
    if (window) {
      if(window.topLeft().x <= 0 && window.size().width <= screen.width/2) {
        window.setSize({
          width: window.size().width - 10,
          height: window.size().height
        });
      }
      else {
        verticalizeAndHalf(window, 'left');
      }
    }
  });

// places the focused window on the upper half of the screen
// if something goes wrong throughs an error
  Key.on('up', [ 'cmd', 'alt' ], function () {
    var screen = Screen.main().flippedVisibleFrame();
    var window = Window.focused();
    if (window) {
      horizontalizeAndHalf(window, 'up');
    }
  });

// places the focused window on the lower half of the screen
// if something goes wrong throughs an error
  Key.on('down', [ 'cmd', 'alt' ], function () {
    var window = Window.focused();
    if (window) {
      horizontalizeAndHalf(window, 'down');
  //     window.setFrame({
		// 	x: window.topLeft().x,
		// 	y: window.topLeft().y + window.size().height/2,
		// 	width: window.size().width,
		// 	height: window.size().height/2
		// });
    }
  });

} catch(error) {
  notifier("Error with configuration.");
  notifier(error);
}

// notifies the user every time the file is saved or changed
notifier("Configurations have been set.");