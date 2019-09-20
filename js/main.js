document.addEventListener("DOMContentLoaded", function(event) {
    var history = [];
    var ANS = 0;
    var symbols = /^[\/\*\+\.x\-]/;
    var symbols1 = /^[\/\*\+x%\-]/;
    var key_count = 0;
    var all_op = new RegExp("[0-9x\+\/\*\b\.\%()\-]", "g");

    var mul_div_op = new RegExp("[x%\*\/]", "g");
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
    var button;
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
            i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    }

    for (button of buttons) {
        button.addEventListener("click", function() {
            var last_index = inp.value.length;
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

            if (this.innerHTML == '/' || this.innerHTML == 'x' || this.innerHTML == '%') {
                if (this.innerHTML && this.innerHTML.match(mul_div_op) != null &&
                    typeof inp.value[last_index - 1] == "undefined") {
                    return false;
                }
            }


            if (this.innerHTML == '%' && last_char == "%") {
                return false;
            }


            if (this.innerHTML.match(ops) != null) {
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

    inp.addEventListener("input", function(e) {
        var invalid_char = "!@#$^&_[]{}\\|;:\'\",<>?";
        var inv_char;
        for (inv_char of invalid_char) {
            inp.value = inp.value.replace(inv_char, '');
        }
    });


    inp.addEventListener("keydown", function(e) {
        inp.setSelectionRange(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
        var key = e.key;
        var last_index = inp.value.length;
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
            dotcount[++dot_count_index] = 0;
        }
        if (key == '.') {
            if (dotcount[dot_count_index] == 1) {
                e.preventDefault();
                return false;
            }
            dotcount[dot_count_index] = 1;
        }


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
        for (elements of history_elements) {
            elements.addEventListener("click", function(e) {

                var ele = this.innerHTML;
                var i = ele.indexOf("=");
                inp.value = ele.slice(0, i);
                inp.focus();
                modal.classList.add("hidden");

            });
        }
        e.stopPropagation();
    });

    document.getElementById("AC").addEventListener("click", function() {
        history = [];
        ANS = 0;
        document.getElementById("expression").innerHTML = '';
        document.getElementById("CE").click();
    });

    document.getElementById("CE").addEventListener("click", function() {
        para_count_reset();
        dotcount = [0];
        dot_count_index = 0;
        inp.value = '';
    });

    document.getElementById("pi").addEventListener("click", function() {
        // var i = inp.value.length - 1;
        // for (; i >= 0; i--) {
        //     if (inp.value[i] == 'A') {
        //         inp.value = inp.value.slice(0, i) + "-" + inp.value.slice(i);
        //         console.log(inp.value);
        //     }
        // }

        inp.value += "π";
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




            temp = temp.replace(/[x]/g, "*");
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

            var ans_indices = getAllIndexes(temp, "ANS");
            var k = 0;
            for (k = 0; k < ans_indices.length; k++) {
                if (typeof temp[ans_indices[k] - 1] != "undefined" && temp[ans_indices[k] - 1].match(operators) == null || temp[ans_indices[k] - 1] == '%') {
                    temp = temp.slice(0, ans_indices[k]) + "*" + temp.slice(ans_indices[k]);
                    ans_indices = getAllIndexes(temp, "ANS");
                }

                if (typeof temp[ans_indices[k] + 3] != "undefined" && temp[ans_indices[k] + 3].match(operators) == null) {
                    temp = temp.slice(0, ans_indices[k] + 3) + "*" + temp.slice(ans_indices[k] + 3);
                    ans_indices = getAllIndexes(temp, "ANS");
                }

            }


            var pi_indices = getAllIndexes(temp, "π");
            k = 0;
            for (k = 0; k < pi_indices.length; k++) {
                if (typeof temp[pi_indices[k] - 1] != "undefined" && temp[pi_indices[k] - 1].match(operators) == null || temp[pi_indices[k] - 1] == '%') {
                    temp = temp.slice(0, pi_indices[k]) + "*" + temp.slice(pi_indices[k]);
                    pi_indices = getAllIndexes(temp, "π");
                }

                if (typeof temp[pi_indices[k] + 1] != "undefined" && temp[pi_indices[k] + 1].match(operators) == null) {
                    temp = temp.slice(0, pi_indices[k] + 1) + "*" + temp.slice(pi_indices[k] + 1);
                    pi_indices = getAllIndexes(temp, "π");
                }

            }
            var π = 22 / 7;


            try {
                var result = eval(temp);
            } catch (e) {
                console.log("Result : ", temp);
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
            document.getElementById("expression").innerHTML = t + "=" + result;
            history.push(t + "=" + inp.value);
        }
        ANS = parseInt(inp.value);
    });
});