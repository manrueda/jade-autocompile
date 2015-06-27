# jade-autocompile package

Auto compile JADE files on save

## Configuration
The two first comment blocks of file can be used to pass parameters to the compiler.

* The first one must have the name of the output html file, like this:

  ```jade
  //compile:output.html
  ```
  If you avoid this comment, the file is omitted by the compiler.

* The second block can have a javascript object to be used as locals for the compiler.

  ```jade
  //{
      name: 'Manuel'
      date: new Date,
      myFunc: function(){
        return true;
      }
    }
  ```
## License
[MIT](LICENSE)
