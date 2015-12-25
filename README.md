# jade-autocompile package [![Build Status](https://travis-ci.org/ManRueda/jade-autocompile.svg?branch=master)](https://travis-ci.org/ManRueda/jade-autocompile)

Auto compile JADE files on save

[Atom package site](https://atom.io/packages/jade-autocompile)

## Configuration
The two first comment blocks of file can be used to pass parameters to the compiler.

* The first one must have the name of the output html file, like this:

  ```jade
  //output:output.html
  ```
  If you avoid this comment, the file is omitted by the compiler.

  The output parameter supports relatives paths and two variables replacement.
  * $1: Name of the original jade file
  * $2: Extension of the original file.

  Also you can add other properties to the compiler, like this:
  ```jade
  //output:output.html, pretty:false
  ```

* The second block can have a javascript object to be used as locals for the compiler.

  ```jade
  //{
      name: 'Manuel',
      date: new Date,
      myFunc: function(){
        return true;
      }
    }
  ```
## License
  The MIT License (MIT)

  Copyright (c) 2015 Manuel Rueda

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
