document.addEventListener("DOMContentLoaded", function(event) {
    var history = [];
    var ANS = 0;
    var symbols = /^[\/\*\+\.x\-]/;
    var symbols1 = /^[\/\*\+x%\-]/;
    var key_count = 0;
    var all_op = new RegExp("[0-9x\+\/\*\b\.\%()\-]", "g");

    var num_or_dot = new RegExp("[0-9\.]", "g");
    var ops = new RegExp("[\+x\/\%\(\)\=\-]", "g");
    var ops1 = new RegExp("[\+x\/\%\)\=\-]", "g");
    var ops2 = new RegExp("[\+x\/\=\-]", "g");
    var ops3 = new RegExp("[\+x\%\/\=\-]", "g");
    var ops4 = new RegExp("[\+x\%\/\=\(\)\-]", "g");
    var operators = /[x\+\/\*\-]/gmi;
    var double_op = new RegExp("[x\+\/\*\.\-]{2}", "gmi");
    var duplicate = new RegExp("[x\+\/\.\*\-]", "gmi");
    var duplicate1 = new RegExp("[x\+\/\*\-]", "gmi");
    var invalid_chars = /[\`\~\!\@\#\$\^\&\_\[\]\{\}\;\:\'\"\,\<\>\?\\\|]/gm;

    var alpha = new RegExp("[a-zA-Z]", "g");

    var inp = document.getElementById("calc-input");
    var buttons = document.getElementsByClassName("calc-btn-op");

    var buttons_count = buttons.length;

    var dotcount = [0];
    var dot_count_index = 0;



    var open_para_count = 0;
    var close_para_count = 0;


    function para_count_reset() {
        open_para_count = 0;
        close_para_count = 0;
    }

    function inc_para_close() {
        if (close_para_count >= open_para_count) {
            return -1;
        }
        close_para_count++;
    }

    function inc_para_open() {
        open_para_count++;
    }

    function getAllIndexes(arr, val) {
        var indexes = [],
            i;
        for (i = 0; i < arr.length; i++)
            if (arr[i] === val)
                indexes.push(i);
        return indexes;
    }

    for (button of buttons) {
        button.addEventListener("click", function() {
            var last_char = inp.value[inp.value.length - 1];

            if (this.innerHTML == 0 && last_char == '/') {
                return false;
            }

            if (symbols.test(this.innerHTML) && symbols.test(last_char)) {
                return false;
            }

            if (this.innerHTML == "(") {
                inc_para_open();
            }
            if (this.innerHTML == ")") {
                if (inc_para_close() == -1 || last_char == "(" || last_char.match(symbols) != null) {
                    return false;
                }
            }

            if (this.innerHTML.match(ops) != null) {
                console.log("op  ", dotcount);
                dotcount[++dot_count_index] = 0;
            }

            if (this.innerHTML.match(ops) != null) {}

            inp.value += this.innerHTML;
            inp.focus();
        });
    }

    var all_buttons = document.getElementsByClassName("calc-btn-no");
    for (button of all_buttons) {
        button.addEventListener("click", function() {
            var last_char = inp.value[inp.value.length - 1];
            inp.focus();
            if (this.innerHTML == '.') {
                console.log("dot  ", dotcount);
                if (dotcount[dot_count_index] == 1) {
                    return false;
                }
                dotcount[dot_count_index] = 1;
                if (inp.value == '' || last_char.match(ops4) != null) {
                    inp.value += '0.';
                } else {
                    inp.value += '.';
                }
            }

            if (this.getAttribute("id") == "backspace") {
                inp.dispatchEvent(new KeyboardEvent('keydown', { 'key': 'Backspace' }));
                inp.value = inp.value.slice(0, -1);
            }
        });
    }


    var prev_input = inp.value;

    inp.addEventListener("focus", function(e) {
        inp.setSelectionRange(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    });
    inp.addEventListener("click", function(e) {
        inp.setSelectionRange(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
    });


    document.addEventListener("click", function(e) {
        var modal = document.getElementById("history-modal");
        modal.classList.add("hidden");
    });

    document.addEventListener("keyup", function(e) {
        var modal = document.getElementById("history-modal");
        modal.classList.add("hidden");

    });

    inp.addEventListener("input", function(e) {});


    inp.addEventListener("keydown", function(e) {
        inp.setSelectionRange(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        var key = e.key;
        var last_index = inp.value.length;
        // console.log(key);
        var last_char = inp.value[last_index - 1];

        if (typeof inp.value[last_index - 1] != "undefined") {
            if (key.match(ops3) != null && inp.value[inp.value.length - 1].match(ops2) != null) {
                e.preventDefault();
                return false;
            }
        }

        if (typeof inp.value[last_index - 1] != "undefined") {
            if (key == '%' && inp.value[inp.value.length - 1] == "%") {
                e.preventDefault();
                return false;
            }
        }

        if (key == '0' && last_char == '/') {
            e.preventDefault();
            return false;
        }


        if (key == "(") {
            inc_para_open();
        }
        if (key == ")") {
            if (inc_para_close() == -1 || last_char == "(" || last_char.match(symbols) != null) {
                e.preventDefault();
                return false;
            }
        }
        if (key.match(ops) != null) {
            console.log("op  ", dotcount);
            dotcount[++dot_count_index] = 0;
        }
        if (key == '.') {
            console.log("dot  ", dotcount);
            if (dotcount[dot_count_index] == 1) {
                e.preventDefault();
                return false;
            }
            dotcount[dot_count_index] = 1;
        }

        console.log(key);

        if (typeof last_char != "undefined" && key == "Backspace") {
            if (last_char == '.') {
                dotcount[dot_count_index] = 0;
            } else if (last_char.match(ops1)) {
                dot_count_index--;
                dotcount.splice(-1, 1);
            }

            if (last_char == ')') {
                close_para_count--;
            } else if (last_char == "(") {
                open_para_count--;
            }
        }

        if (key.match(invalid_chars) != null) {
            e.preventDefault();
            return false;
        }

        if (key.length == 1 && key.match(alpha) != null || key == "ArrowLeft" || key == "ArrowRight" || key == "ArrowUp") {

            e.preventDefault();
            // e.stopPropagation();
            return false;
        }

        if (e.key == "*") {
            e.preventDefault();
            document.getElementById("x").click();
            inp.focus();
        }

        if (key.match(ops) != null) {
            // dotreset();
        }

        if (key == "Delete") {
            inp.value = '';
        }

        if (inp.value[last_index - 1] && inp.value[last_index - 1].match(duplicate) != null && key.match(duplicate1) != null) {
            e.preventDefault();
            return false;
        }
    });


    inp.addEventListener("keyup", function(e) {
        var last_index = inp.value.length;

        var key = e.key;
        var last_index = inp.value.length;


        if (inp.value[last_index - 1]) {
            if (inp.value[last_index - 1] == '.' && ((typeof inp.value[last_index - 2] == "undefined") ||
                    /* inp.value[last_index - 2] && inp.value[last_index - 2].match(operators) != null)) { */
                    inp.value[last_index - 2] && inp.value[last_index - 2].match(ops) != null)) {
                inp.value = inp.value.slice(0, last_index - 1) + "0" + inp.value.slice(last_index - 1);
                return false;
            }
        }
        var mul_div_op = new RegExp("[x%\*\/]", "g");
        if (inp.value[last_index - 1] && inp.value[last_index - 1].match(mul_div_op) != null &&
            typeof inp.value[last_index - 2] == "undefined") {
            inp.value = inp.value.slice(0, -1);
        }

        if (e.keyCode == 13) {
            e.preventDefault();
            document.getElementById("=").click();
            e.stopPropagation();
        }

        if (!/(((\d)*((\.(\d)+)?))+)|[\/\*\+%\-]{1}/g.test(inp.value[inp.value.length - 1])) {
            inp.value = inp.value.slice(0, -1);
        }
        if (!/(((\d)*((\.(\d)+)?))+)|[\/\*\+%\-]{1}/g.test(inp.value)) {
            inp.value = inp.value.slice(0, -1);
        }
    });


    var dot = document.getElementById(".");
    dot.addEventListener("click", function() {
        var inp_value = inp.value;
        if (inp_value == '') {
            inp.value = "0";
        }
    });


    document.getElementById("history").addEventListener("click", function(e) {
        var modal = document.getElementById("history-modal");
        modal.innerHTML = '';
        if (history.length == 0) {
            return false;
        }
        for (equation of history) {
            node = document.createElement("p");
            node.setAttribute("class", "history-elements");
            var textnode = document.createTextNode(equation);
            node.appendChild(textnode);
            modal.appendChild(node);
        }
        modal.classList.toggle("hidden");
        var history_elements = document.getElementsByClassName("history-elements");
        // console.log(history_elements);
        for (elements of history_elements) {
            elements.addEventListener("click", function(e) {

                var ele = this.innerHTML;
                // console.log(ele);
                var i = ele.indexOf("=");
                inp.value = ele.slice(0, i);
                inp.focus();
                modal.classList.add("hidden");

            });
        }
        e.stopPropagation();
    });

    document.getElementById("AC").addEventListener("click", function() {

        document.getElementById("CE").click();
    });

    document.getElementById("CE").addEventListener("click", function() {
        // dotreset();
        inp.value = '';
    });

    document.getElementById("-ve").addEventListener("click", function() {
        inp.value *= -1;
    });

    document.getElementById("=").addEventListener("click", function(e) {

        if (open_para_count != close_para_count) {
            return false;
        }

        var temp = inp.value;
        var t = temp;

        if (temp) {


            if (temp[temp.length - 1].match(operators) != null) {
                e.preventDefault();
                return false;
            }
            var j = 0;
            var open_index = getAllIndexes(temp, "(");
            for (j of open_index) {
                if (typeof temp[j - 1] != "undefined" && temp[j - 1].match(num_or_dot) != null) {
                    temp = temp.slice(0, j) + "*" + temp.slice(j);
                }
            }
            var close_index = getAllIndexes(temp, ")");
            for (j of close_index) {
                if (typeof temp[j + 1] != "undefined" && temp[j + 1].match(num_or_dot) != null) {
                    temp = temp.slice(0, j + 1) + "*" + temp.slice(j + 1);
                }
            }


            var ans_index = -1;
            if ((ans_index = temp.indexOf("ANS")) != -1) {
                if (typeof temp[ans_index - 1] != "undefined" && temp[ans_index - 1].match(operators) == null || temp[ans_index - 1] == '%') {
                    temp = temp.slice(0, ans_index) + "x" + temp.slice(ans_index);

                }
            }

            temp = temp.replace("x", "*");
            var percentage_index = -1,
                i = temp.length - 1,
                op = '';
            while ((percentage_index = temp.indexOf("%")) != -1) {
                for (i = percentage_index - 1;
                    (typeof temp[i] == "undefined" || (op = temp[i].match(operators)) == null) && i > -1; i--);

                if (i == -1) { // The number with percentage is first number
                    temp = temp.slice(0, percentage_index) + "/100" + temp.slice(percentage_index + 1);

                } else {

                    if (op == '+' || op == '-') {
                        temp = temp.slice(0, i) + "*(1" + op + "(" + temp.slice(i + 1, percentage_index) + "/100))" + temp.slice(percentage_index + 1);

                    } else if (op == '/' || op == '*') {
                        temp = temp.slice(0, i + 1) + "(" + temp.slice(i + 1, percentage_index) + "/100)" + temp.slice(percentage_index + 1);

                    }
                }
            }

            try {
                var result = eval(temp);
            } catch (e) {
                console.log(temp);
                console.log(e);
                return false;
            }
            result = parseFloat(result);
            result = result.toFixed(10);
            result = result.toString();
            result = parseFloat(result);
            inp.value = result;
            if (result == "Infinity") {
                e.preventDefault();
                return false;
            }
            temp = temp.replace("*", "x");
            document.getElementById("expression").innerHTML = t;
            history.push(t + "=" + inp.value);
        }
        ANS = parseInt(inp.value);
    });
});