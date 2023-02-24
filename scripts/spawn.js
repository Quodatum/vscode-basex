function Process() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const process = require('child_process'); 
    var output='';  
    var ls = process.spawn('basex.bat',["current-dateTime()"]);
    ls.stdout.on('data', function (data) {
      output+=data;
    });
    ls.stderr.on('data', function (data) {
      console.log(data);
    });
    ls.on('close', function (code) {
       if (code == 0)
            console.log(output);
       else
            console.log('Error',code);
    });
}

Process();
