/* global jQuery */
/* global Motors */
/* eslint-disable eqeqeq */

AoPS.Utils.initKeyChain(AoPS, "Ecole", "Utils");

AoPS.Ecole.Utils = (function (Utils) {
	// Moment Helpers
	Utils.FindMonday = function (dt) {
		return dt.day() == 0 ? dt.day(1).subtract({day: 7}) : dt.day(1);
	};
	Utils.FindOffset = function (dt) {
		return (dt.day() + 6) % 7;
	};
	Utils.SqlDateTimeToMoment = function (dt) {
		return moment(dt, "YYYY-MM-DD HH:mm:ss");
	};
	Utils.SqlDateToMoment = function (dt) {
		return moment(dt, "YYYY-MM-DD");
	};
	Utils.SqlTimeToMoment = function (dt) {
		return moment(dt, "HH:mm:ss");
	};
	Utils.MomentToSqlDateTime = function (dt) {
		return dt.format("YYYY-MM-DD HH:mm:ss");
	};
	Utils.MomentToSqlDate = function (dt) {
		return dt.format("YYYY-MM-DD");
	};
	Utils.MomentToSqlTime = function (dt) {
		return dt.format("HH:mm:ss");
	};

	Utils.ArrayToCommaSeparatedString = function (array, opt) {
		var output = "";
		opt = _.extend({oxford: false, ampersand: false}, opt);
		for (var i = 0; i < array.length; i++) {
			if (i > 0 && i + 1 >= array.length) {
				output += array.length > 2 && opt.oxford ? "," : "";
				output += opt.ampersand ? " & " : " and ";
			} else if (i > 0) {
				output += ", ";
			}
			output += array[i];
		}
		return output;
	};

	// Adapted from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
	Utils.copyTextToClipboard = function (text, success, failure) {
		if (navigator.clipboard) {
			navigator.clipboard.writeText(text);
			if (_.isFunction(success)) {
				success();
			}
		} else {
			var $textArea = $("<textarea />")
				.val(text)
				.css({top: "0", left: "0", position: "fixed", opacity: "0"})
				.appendTo("body")
				.focus()
				.select();
			try {
				var successful = document.execCommand("copy");
				if (successful && _.isFunction(success)) {
					success();
				} else if (!successful && _.isFunction(failure)) {
					failure();
				}
			} catch (err) {
				if (_.isFunction(failure)) {
					failure();
				}
			}
			$textArea.remove();
		}
	};

	Utils.ParseVector = function (response) {
		var result = [];
		response.replace(/\[?([^,]*)(,|\])/g, function (match, cell) {
			result.push(cell);
		});
		return result;
	};

	Utils.ParseMatrix = function (response) {
		var result = [];
		response.replace(/\[?(\[[^\[\]]*\])(,|\])/g, function (match, vector) {
			result.push(Utils.ParseVector(vector));
		});
		return result;
	};

	Utils.ParseFromMatrixOrVector = function (value) {
		var result = "";
		if (_.isArray(value)) {
			result += "[";
			_.each(value, function (elem, index) {
				result += (index > 0 ? "," : "") + Utils.ParseFromMatrixOrVector(elem);
			});
			result += "]";
		} else {
			result += value;
		}
		return result;
	};

	Utils.ScrollToTop = function ($el, success) {
		$("html, body")
			.first()
			.animate(
				{scrollTop: Math.max(0, $el.position().top - 45)},
				"slow",
				function () {
					if (_.isFunction(success)) {
						setTimeout(success, 250);
					}
				}
			);
	};

	Utils.ScrollToBottom = function ($el, success) {
		$("html, body")
			.first()
			.animate(
				{
					scrollTop: Math.max(
						0,
						$el.position().top + $el.height() - $(window).height() + 25
					),
				},
				"slow",
				function () {
					if (_.isFunction(success)) {
						setTimeout(success, 250);
					}
				}
			);
	};

	Utils.ScrollToVisible = function ($el, success) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemTop = $el.offset().top;
		var elemBottom = elemTop + $el.height();

		if (docViewTop <= elemTop && elemBottom <= docViewBottom) {
			if (_.isFunction(success)) {
				success();
			}
		} else {
			Utils.ScrollToTop($el, success);
		}
	};

	Utils.ElementIsVisible = function ($elem, isMostlyVisible) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();
		var elemTop = $elem.offset().top;
		var elemBottom = elemTop + $elem.height();

		if (isMostlyVisible) {
			return !(
				elemBottom >= docViewBottom &&
				elemTop >= 0.75 * docViewBottom + 0.25 * docViewTop
			);
		} else {
			return (
				docViewTop <= elemTop &&
				docViewTop <= elemBottom &&
				elemTop <= docViewBottom &&
				elemBottom <= docViewBottom
			);
		}
	};

	Utils.CreateFlashBox = function (
		message,
		css_class,
		insert_function,
		$anchor_to,
		delay
	) {
		var $div = $("<div />")
			.text(message)
			.addClass(css_class || "info-box");
		$div[insert_function || "prependTo"]($anchor_to || $("body"))
			.delay(delay || 2500)
			.fadeOut("slow");
	};

	Utils.CreateTooltipBreaker = function ($el) {
		setTimeout(function () {
			if ($(".ecole-mouseover-wrapper:visible").length) {
				if ($el.is(":visible")) {
					Utils.CreateTooltipBreaker($el);
				} else {
					$(".ecole-mouseover-wrapper").remove();
				}
			}
		}, 250);
	};

	Utils.CreateTooltip = function (anchor, body) {
		var $anchor = anchor instanceof jQuery ? anchor : $(anchor);
		var $wrapper = $("<div />").addClass("ecole-mouseover-wrapper");
		var $body =
			body instanceof jQuery
				? body.clone()
				: $("<div />").text(_.isUndefined(body) ? $anchor.attr("title") : body);
		$body.addClass("body").appendTo($wrapper);
		_.each($anchor, function (el) {
			var $el = $(el);
			$el
				.attr("title", null)
				.addClass("ecole-mouseover-anchor")
				.hover(
					function () {
						$(".ecole-mouseover-wrapper").remove();
						if ($el.is(":visible")) {
							$wrapper.appendTo($("body")).show();
							$wrapper.offset({
								top:
									$el.offset().top + 50 > $(window).height()
										? $el.offset().top - $wrapper.height() - 20
										: $el.offset().top + $el.height() + 10,
								left:
									$el.offset().left + $wrapper.width() + 20 > $(window).width()
										? $el.offset().left + $el.width() - $wrapper.width() - 10
										: $el.offset().left + 5,
							});
						}
						Utils.CreateTooltipBreaker($el);
					},
					function () {
						$(".ecole-mouseover-wrapper").remove();
					}
				);
		});
		return $wrapper;
	};

	Utils.BackboneModelToObject = function (model) {
		var object = _.clone(model.attributes);
		_.each(object, function (value, key) {
			if (value instanceof Backbone.Collection) {
				object.key = Utils.BackboneCollectionToArray(value);
			}
		});
		return object;
	};

	Utils.BackboneCollectionToArray = function (collection, depth) {
		var objects = [];
		_.each(collection.models, function (model) {
			if (model instanceof Backbone.Model) {
				objects.push(Utils.BackboneModelToObject(model));
			} else {
				objects.push(model);
			}
		});
		return objects;
	};

	// Create a modal you can't click away
	Utils.CreateModalInescapable = function (body) {
		var $div = $("<div />").append(
			body instanceof jQuery
				? body
				: $("<div />")
						.css({padding: "5px"})
						.text(body || "Please wait...")
		);
		return $div.showPlainModal({
			scrollable: true,
			force_response: true,
			closeX: false,
		});
	};

	// These are a bit more robust than the usual Ui.Modal because the correct modal is closed.
	// Also, chaining is possible.
	Utils.CreateModalAlert = function (body, success, options) {
		var modal = AoPS.Ui.Modal.showAlert(
			body,
			_.extend(
				{
					onButtonClick: function () {
						AoPS.Ui.Modal.removeModal(modal);
						if (_.isFunction(success)) {
							success();
						}
					},
					close_on_button_click: false,
				},
				options || {}
			)
		);
		return modal;
	};

	Utils.CreateModalPrompt = function (body, value, success, cancel, options) {
		options = options || {};

		var $body = $("<div />").append(
			body instanceof jQuery ? body : $("<div />").text(body)
		);
		var $text = $(options.textarea ? "<textarea />" : "<input />").val(value);

		if (options.input_attr) {
			options.attr(options.input_attr);
		}

		$("<form />")
			.append($text)
			.appendTo($body)
			.submit(function (e) {
				e.preventDefault();
				AoPS.Ui.Modal.removeModal(modal);
				if (_.isFunction(success)) {
					success($text.val());
				}
			});

		$text.css(options.text_css || {width: "100%"});

		var modal = AoPS.Ui.Modal.showConfirm(
			$body,
			function (ok) {
				AoPS.Ui.Modal.removeModal(modal);
				if (ok) {
					if (_.isFunction(success)) {
						success($text.val());
					}
				} else {
					if (_.isFunction(cancel)) {
						cancel($text.val());
					}
				}
			},
			_.extend({close_on_button_click: false}, options || {})
		);
		$text.focus();

		return modal;
	};

	/**
	 * CreateModalPrompt but with more than one input
	 *
	 * @param {String} text Title text of the modal
	 * @param {Array} inputs Array of objects with attributes to create inputs
	 */
	Utils.CreateModalManyPrompts = function (
		text,
		inputs,
		success,
		cancel,
		options
	) {
		var getResponses = function () {
			return _.reduce(
				$form.find(".input-area"),
				function (r, input) {
					r[input.name] = input.value;
					return r;
				},
				{}
			);
		};

		options = options || {};

		var $form = $("<form />");
		inputs.forEach((input) => {
			var $span = $("<span />")
				.addClass("label")
				.text(input.text)
				.css(input.label_css || {display: "inline-block", width: "100%"});
			var $text = $(input.textarea ? "<textarea />" : "<input />")
				.val(input.value)
				.attr("name", input.name)
				.addClass("input-area")
				.css(input.text_css || {width: "100%"});
			$("<div />")
				.append($("<label />").append($span).append($text))
				.appendTo($form);
		});

		if (options.input_attr) {
			options.attr(options.input_attr);
		}

		$form.submit(function (e) {
			e.preventDefault();
			AoPS.Ui.Modal.removeModal(modal);
			if (_.isFunction(success)) {
				success(getResponses());
			}
		});

		var $body = $("<div />");
		if (text && text.length > 1) {
			$body.append($("<div />").text(text));
		}
		$body.append($form);

		var modal = AoPS.Ui.Modal.showConfirm(
			$body,
			function (ok) {
				AoPS.Ui.Modal.removeModal(modal);
				if (ok) {
					if (_.isFunction(success)) {
						success(getResponses());
					}
				} else {
					if (_.isFunction(cancel)) {
						cancel(getResponses());
					}
				}
			},
			_.extend({close_on_button_click: false}, options || {})
		);

		$form.find(".input-area").first().focus();

		return modal;
	};

	Utils.CreateModalSelectPrompt = function (
		body,
		values,
		success,
		cancel,
		options
	) {
		options = options || {};

		var $body = $("<div />").append(
			body instanceof jQuery ? body : $("<div />").text(body)
		);
		var $select = $("<select />");
		$("<form />")
			.append($select)
			.appendTo($body)
			.submit(function (e) {
				e.preventDefault();
				AoPS.Ui.Modal.removeModal(modal);
				if (_.isFunction(success)) {
					success($select.val());
				}
			});

		_.each(values, function (row) {
			var $option = $("<option />").appendTo($select);
			$option
				.val(row.value)
				.text(row.name)
				.attr(row.selected ? {selected: "selected"} : {});
		});

		var modal = AoPS.Ui.Modal.showConfirm(
			$body,
			function (ok) {
				AoPS.Ui.Modal.removeModal(modal);
				if (ok) {
					if (_.isFunction(success)) {
						success($select.val());
					}
				} else {
					if (_.isFunction(cancel)) {
						cancel($select.val());
					}
				}
			},
			_.extend({close_on_button_click: false}, options || {})
		);
		$select.focus();

		return modal;
	};

	Utils.CreateModalConfirm = function (body, success, cancel, options) {
		var modal = AoPS.Ui.Modal.showConfirm(
			body,
			function (ok) {
				AoPS.Ui.Modal.removeModal(modal);
				if (ok) {
					if (_.isFunction(success)) {
						success();
					}
				} else {
					if (_.isFunction(cancel)) {
						cancel();
					}
				}
			},
			_.extend(
				{
					confirm_button_ok: "Yes",
					confirm_button_cancel: "No",
					close_on_button_click: false,
				},
				options || {}
			)
		);
		return modal;
	};

	Utils.ConvertFromBackbone = function (value, depth) {
		if (value instanceof Backbone.Model) {
			return Utils.BackboneModelToObject(value);
		} else if (value instanceof Backbone.Collection) {
			return Utils.BackboneCollectionToArray(value);
		}
		return value;
	};

	Utils.NameAndEmail = function (name, email) {
		name = name.replace(/\"/g, "'").trim();
		email = email.replace(/[<>]/g, "").trim();
		return name ? '"' + name + '" <' + email + ">" : email;
	};

	Utils.FormToObject = function ($form) {
		// Adapted from .serializeObject by Ben Alman
		var obj = {};
		_.each($form.serializeArray(), function (el) {
			if (_.isUndefined(obj[el.name])) {
				obj[el.name] = el.value;
			} else {
				obj[el.name] = _.isArray(obj[el.name])
					? obj[el.name].concat(el.value)
					: [obj[el.name], el.value];
			}
		});
		return obj;
	};

	Utils.ProcessProblemText = function (body, $caption) {
		_.each(
			(body instanceof jQuery ? body : $(body)).find("problem_options"),
			function (problem_options) {
				var $problem_options = $(problem_options);
				var $div = $("<div />")
					.addClass("select-problem-options")
					.insertBefore($problem_options);
				var $ol = $("<ol />")
					.addClass("bbcode_list")
					.css("list-style-type", "upper-alpha")
					.appendTo($caption instanceof jQuery ? $div.prepend($caption) : $div);

				_.each(
					$problem_options.find("problem_option"),
					_.bind(function (option) {
						$("<li />").html($(option).text()).appendTo($ol);
					}, this)
				);
				$problem_options.remove();
			}
		);

		return body; // For chaining
	};

	Utils.EditableHelper = function ($el, opt) {
		opt.event = opt.event !== undefined ? opt.event : "click";
		opt.data = opt.data !== undefined ? opt.data : $el.text();
		opt.placeholder =
			opt.placeholder !== undefined ? opt.placeholder : "<i>[Add]</i>";
		opt.default = opt.default !== undefined ? opt.default : "";
		opt.tooltip = opt.tooltip !== undefined ? opt.tooltip : "Click to edit...";
		opt.width = opt.width !== undefined ? opt.width : "auto";
		return opt;
	};

	Utils.CreateEditableStandard = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		$el.addClass("ecole-no-select");
		$el.html($el.html().trim() || $("<div />").text(opt.data).html().trim());
		$el
			.hover(function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					$el.addClass("ecole-clickable");
					$el.editable("enable");
				} else {
					$el.removeClass("ecole-clickable");
					$el.editable("disable");
				}
			})
			.editable(opt.save, {
				data: opt.data,
				event: opt.event,
				placeholder: opt.placeholder,
				tooltip: opt.tooltip,
				select: true,
				onblur: "submit",
				onselect: "submit",
			});
	};

	// Requires jquery.simulate.js
	Utils.CreateEditableSelect = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		opt.$display = $("<div />").addClass("ecole-no-select");
		opt.$display.html(
			$el.html().trim() ||
				$("<div />").text(opt.data).html().trim() ||
				opt.placeholder.trim() ||
				"&nbsp;"
		);
		opt.$display
			.hover(function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					$el.addClass("ecole-clickable");
				} else {
					$el.removeClass("ecole-clickable");
				}
			})
			.bind(opt.event, function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					opt.$display.hide();
					opt.$edit.show().select().focus().simulate("mousedown");
				}
			});
		if (opt.tooltip) {
			opt.$display.attr("title", opt.title);
		}

		opt.flag = false;
		opt.$edit = $("<select />").on(
			"change blur",
			_.bind(function () {
				opt.save(opt.$edit.val());
			}, this)
		);

		if (_.isArray(opt.options)) {
			_.each(opt.options, function (option) {
				opt.$edit.append(
					$("<option />")
						.attr({
							value: option.value,
							selected: opt.selected == option.value ? true : false,
						})
						.text(option.name)
				);
			});
		} else if (_.isObject(opt.options)) {
			_.each(opt.options, function (name, value) {
				opt.$edit.append(
					$("<option />")
						.attr({
							value: value,
							selected: opt.selected == value ? true : false,
						})
						.text(name)
				);
			});
		}

		$el.html("").append(opt.$display.show()).append(opt.$edit.hide());
	};

	/**
	 * Creates a clickable field that turns into a motor editor.
	 *
	 * @param {*} $el The clickable element to place the editor in.
	 * @param {*} opt Helper values and functions. Can includes functions for what
	 * to do when the editor is opened/closed, and an enabled() function
	 * to control whether the field is in an editable mode or not.
	 */
	Utils.CreateEditableMotored = function ($el, opt) {
		$el.hover(function (event) {
			if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
				$el.addClass("ecole-clickable");
				if ($el.editable) {
					$el.editable("enable");
				}
			} else {
				$el.removeClass("ecole-clickable");
				if ($el.editable) {
					$el.editable("disable");
				}
			}
		});

		var motorInfo = {};
		if (opt.selected) {
			try {
				motorInfo = JSON.parse(opt.selected);
			} catch (error) {
				// ignore
			}
		}

		if (motorInfo && motorInfo.length > 0) {
			motorInfo = motorInfo[0];
		}

		$el.click(function () {
			if (opt.enabled($el)) {
				$el.text("").css("font-style", "normal");
				var motored = AoPS.Motored.createMotored({
					closeOnSave: opt.hasOwnProperty("closeOnSave")
						? opt.closeOnSave
						: true,
					includeCloseButton: opt.hasOwnProperty("includeCloseButton")
						? opt.includeCloseButton
						: true,
					includeDropdown: opt.hasOwnProperty("includeDropdown")
						? opt.includeDropdown
						: true,
					includeSaveTemplate: opt.hasOwnProperty("includeSaveTemplate")
						? opt.includeSaveTemplate
						: false,
					includePreview: opt.hasOwnProperty("includePreview")
						? opt.includePreview
						: true,
					includeSaveMotor: opt.hasOwnProperty("includeSaveMotor")
						? opt.includeSaveMotor
						: true,
					includeRefHashInput: opt.hasOwnProperty("includeRefHashInput")
						? opt.includeRefHashInput
						: true,
					initialMotorRef: motorInfo.motor_ref || opt.motor_ref || "",
					onClose: function (motor) {
						if (opt.onCloseMotored) {
							opt.onCloseMotored();
						}
						opt.save(motor);
					},
				});

				if (opt.onOpenMotored) {
					opt.onOpenMotored(motored);
				}

				$el.off("click");
				$el.append(motored.motored);
			}
		});
	};

	Utils.CreateEditableJSON = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		opt.$display = $("<div />").addClass("ecole-json-container");
		opt.$edit = $("<div />");

		opt.renderHelper = function ($outer, data, editStructure, alertMothership) {
			var me = {
				data: _.clone(data),
				$row: $("<div />").addClass("ecole-json-row").appendTo($outer),
				highlightIn: function ($btn, $matches, className) {
					if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
						$btn.addClass("ecole-clickable");
						_.each($matches, function (match) {
							$(match).addClass(className);
						});
						me.$row.addClass("ecole-json-highlight");
					} else {
						$btn.removeClass("ecole-clickable");
					}
				},
				getStructure: function (a) {
					if (_.isArray(a)) {
						return "array";
					} else if (_.isObject(a)) {
						return "object";
					} else {
						return "primitive";
					}
				},
				getType: function (a) {
					// Note: a must be a primitive
					if (_.isBoolean(a)) {
						return "boolean";
					} else if (_.isNumber(a)) {
						return "number";
					} else if (_.isString(a)) {
						return "string";
					} else {
						return "null";
					}
				},
				highlightOut: function ($btn, $matches, className) {
					$btn.addClass("ecole-clickable");
					_.each($matches, function (match) {
						$(match).removeClass(className);
					});
					me.$row.removeClass("ecole-json-highlight");
				},
				updateNewKeyArrayObjectInPlace: function (
					modifyArray,
					modifyObject,
					prompt,
					key
				) {
					if (_.isFunction(opt.enabled) && !opt.enabled($el)) {
						return;
					}
					if (me.structure == "array") {
						modifyArray();
					} else {
						Utils.CreateModalPrompt(
							prompt || "Please enter a new key:",
							key || "",
							function (new_key) {
								if (!new_key) {
									Utils.CreateModalAlert("Error: Empty key not allowed!");
								} else if (!_.isUndefined(me.data[new_key])) {
									Utils.CreateModalAlert("Error: Key already exists!");
								} else {
									modifyObject(new_key);
								}
							}
						);
					}
				},
				updateArrayObjectInPlace: function (modifyArray, modifyObject) {
					if (_.isFunction(opt.enabled) && !opt.enabled($el)) {
						return;
					}
					if (me.structure == "array") {
						modifyArray();
					} else {
						modifyObject();
					}
				},
				updateStructure: function (data2, update, prompt) {
					if (_.isFunction(opt.enabled) && !opt.enabled($el)) {
						return;
					}

					var process = function () {
						var new_data = data2;
						var old_struct = structure;
						var new_struct = $radio.find("input:checked").val();

						if (old_struct !== new_struct) {
							if (new_struct == "primitive") {
								new_data = JSON.stringify(data2);
							} else if (new_struct == "array") {
								if (old_struct == "primitive") {
									try {
										new_data = JSON.parse(data2);
									} catch (e) {
										new_data = data2;
									}

									if (_.isArray(new_data)) {
										// Good!
									} else if (_.isObject(new_data)) {
										new_data = _.values(new_data);
									} else {
										new_data = [data2];
									}
								} else if (old_struct == "object") {
									new_data = _.values(data2);
								}
							} else if (new_struct == "object") {
								if (old_struct == "primitive") {
									try {
										new_data = JSON.parse(data2);
									} catch (e) {
										new_data = data2;
									}

									if (_.isArray(new_data)) {
										new_data = _.reduce(
											new_data,
											function (aggr, value, index) {
												aggr[index] = value;
												return aggr;
											},
											{}
										);
									} else if (_.isObject(new_data)) {
										// Good!
									} else {
										new_data = {0: data2};
									}
								} else if (old_struct == "array") {
									new_data = _.reduce(
										me.data,
										function (aggr, value, index) {
											aggr[index] = value;
											return aggr;
										},
										{}
									);
								}
							}
						}
						update(new_data);
					};

					var structure = me.getStructure(data);
					var $body = $("<div />").text(prompt || "Choose a new structure:");
					var $form = $("<form />")
						.appendTo($body)
						.submit(function (e) {
							AoPS.Ui.Modal.removeModal(modal);
							process();
							e.preventDefault();
						});
					var $radio = $("<div />")
						.addClass("ecole-json-radio")
						.appendTo($form);

					_.each(
						{
							primitive: "Primitive",
							array: "Array",
							object: "Object",
						},
						function (caption, name) {
							var $label = $("<label />").appendTo($radio);
							var $caption = $("<span />").text(caption).appendTo($label);
							$("<input />")
								.val(name)
								.insertBefore($caption)
								.attr({
									name: "type",
									type: "radio",
									checked: structure == name ? "checked" : null,
								});
						}
					);

					var modal = AoPS.Ui.Modal.showConfirm($body, function (ok) {
						if (ok) {
							process();
						}
					});
					$radio.find("input:checked").focus();
				},
				updatePrimitive: function (data2, update, prompt) {
					if (_.isFunction(opt.enabled) && !opt.enabled($el)) {
						return;
					}

					var process = function () {
						var new_type = $radio.find("input:checked").val();
						var new_val = $text.val(),
							new_data = data2;
						if (new_type == "auto") {
							if (_.contains(["", "null"], new_val.trim().toLowerCase())) {
								new_data = null;
							} else if (
								_.contains(["true", "false"], new_val.trim().toLowerCase())
							) {
								new_data =
									new_val.trim().toLowerCase() == "true" ? true : false;
							} else if (Number(new_val).toString() == new_val) {
								new_data = Number(new_val);
							} else {
								new_data = new_val;
							}
						} else if (new_type == "null") {
							new_data = null;
						} else if (new_type == "number") {
							new_data = Number(new_val);
						} else if (new_type == "boolean") {
							if (new_val.trim().toLowerCase() == "false") {
								new_data = false;
							} else if (Number(new_val).toString() == new_val) {
								new_data = Number(new_val) ? true : false;
							} else {
								new_data = new_val ? true : false;
							}
						} else {
							new_data = new_val;
						}
						update(new_data);
					};

					var type = me.getType(data2);
					var $body = $("<div />").text(prompt || "Please enter a new value:");
					var $form = $("<form />")
						.appendTo($body)
						.submit(function (e) {
							AoPS.Ui.Modal.removeModal(modal);
							process();
							e.preventDefault();
						});
					var $text = $("<textarea />")
						.appendTo($form)
						.css({width: "640px", height: "320px"});
					var $radio = $("<div />")
						.addClass("ecole-json-radio")
						.appendTo($form);

					if (
						!_.isString(data2) ||
						!_.contains(
							["", "null", "true", "false"],
							data2.trim().toLowerCase()
						)
					) {
						type = "auto";
					}

					_.each(
						{
							auto: "Auto",
							number: "Numerical",
							string: "String",
							boolean: "Boolean",
							null: "Null",
						},
						function (caption, name) {
							var $label = $("<label />").appendTo($radio);
							var $caption = $("<span />").text(caption).appendTo($label);
							$("<input />")
								.val(name)
								.insertBefore($caption)
								.attr({
									name: "type",
									type: "radio",
									checked: type == name ? "checked" : null,
								});
						}
					);

					var autoHide = function () {
						if ($radio.find("input:checked").val() == "null") {
							$text.hide();
						} else {
							$text.show();
						}
					};
					$radio.find("input").change(autoHide);

					var modal = AoPS.Ui.Modal.showConfirm($body, function (ok) {
						if (ok) {
							process();
						}
					});
					if ($text.is(":visible")) {
						$text.focus().val(data2);
					} else {
						$radio.find("input:checked").focus();
					}
				},
				load: function () {
					me.$struct = $("<div />")
						.addClass("ecole-json-type")
						.appendTo(me.$row);
					me.$inner = $("<div />")
						.addClass("ecole-json-value")
						.appendTo(me.$row);
					me.$after = $("<div />")
						.addClass("ecole-json-after")
						.appendTo(me.$row);
					me.structure = me.getStructure(me.data);
					me.$inner.addClass("ecole-json-" + me.structure);
					if (_.contains(["array", "object"], me.structure)) {
						me.$last_row = null;
						me.$container = $("<div />")
							.addClass("ecole-json-outer")
							.appendTo(me.$inner);
						_.each(me.data, function (val, key) {
							var $row = $("<div />")
								.addClass("ecole-json-row")
								.appendTo(me.$container);
							var $current_last = me.$last_row;

							var $insert = $("<span />")
								.text("[+]")
								.appendTo(
									$("<div />").addClass("ecole-json-insert").appendTo($row)
								);
							$insert
								.addClass("ecole-no-select")
								.hover(
									function (event) {
										me.highlightIn(
											$insert,
											me.structure == "object" ? [$key, $val] : [$val],
											"ecole-json-to-add"
										);
									},
									function (event) {
										me.highlightOut(
											$insert,
											me.structure == "object" ? [$key, $val] : [$val],
											"ecole-json-to-add"
										);
									}
								)
								.bind(opt.event, function (event) {
									me.updateNewKeyArrayObjectInPlace(
										function () {
											me.updatePrimitive(
												null,
												function (new_val) {
													me.data.unshift(new_val);
													alertMothership(me.data);
												},
												"Please choose a value to add (You can change type later):"
											);
										},
										function (new_key) {
											me.updatePrimitive(
												null,
												function (new_val) {
													me.data = _.reduce(
														me.data,
														function (aggr, value, index) {
															if (key == index) {
																aggr[new_key] = new_val;
															}
															aggr[index] = value;
															return aggr;
														},
														{}
													);
													alertMothership(me.data);
												},
												"Please choose a value to add (You can change type later):"
											);
										}
									);
								});

							var $up = $("<div />")
								.addClass("ecole-json-move")
								.css({
									visibility: $current_last ? "visible" : "hidden",
								})
								.html("[&uarr;]")
								.appendTo($row);
							$up
								.addClass("ecole-no-select")
								.hover(
									function (event) {
										me.highlightIn(
											$up,
											[$row, $current_last],
											"ecole-json-to-add"
										);
									},
									function (event) {
										me.highlightOut(
											$up,
											[$row, $current_last],
											"ecole-json-to-add"
										);
									}
								)
								.bind(opt.event, function (event) {
									me.updateArrayObjectInPlace(
										function () {
											if (key > 0) {
												var tmp = me.data[key - 1];
												me.data[key - 1] = me.data[key];
												me.data[key] = tmp;
												alertMothership(me.data);
											}
										},
										function () {
											var ok = _.keys(me.data);
											var ok_index = ok.indexOf(key);
											if (ok_index > 0) {
												var tmp = ok[ok_index - 1];
												ok[ok_index - 1] = ok[ok_index];
												ok[ok_index] = tmp;
												me.data = _.reduce(
													ok,
													function (aggr, o_key) {
														aggr[o_key] = me.data[o_key];
														return aggr;
													},
													{}
												);
												alertMothership(me.data);
											}
										}
									);
								});

							var $key;
							if (me.structure == "object") {
								$key = $("<div />")
									.addClass("ecole-json-key")
									.text(key)
									.appendTo($row);
							}
							var $val = $("<div />")
								.addClass("ecole-json-value")
								.appendTo($row);
							opt.renderHelper($val, val, true, function (updated) {
								me.data[key] = _.clone(updated);
								alertMothership(me.data);
							});

							var $rid = $("<span />")
								.text("[-]")
								.appendTo(
									$("<div />").addClass("ecole-json-rid").appendTo($row)
								);
							$rid
								.addClass("ecole-no-select")
								.hover(
									function (event) {
										me.highlightIn(
											$rid,
											me.structure == "object" ? [$key, $val] : [$val],
											"ecole-json-to-rid"
										);
									},
									function (event) {
										me.highlightOut(
											$rid,
											me.structure == "object" ? [$key, $val] : [$val],
											"ecole-json-to-rid"
										);
									}
								)
								.bind(opt.event, function (event) {
									me.updateArrayObjectInPlace(
										function () {
											me.data.splice(key, 1);
											alertMothership(me.data);
										},
										function (new_key) {
											me.data = _.reduce(
												me.data,
												function (aggr, value, index) {
													if (key != index) {
														aggr[index] = value;
													}
													return aggr;
												},
												{}
											);
											alertMothership(me.data);
										}
									);
								});

							if (me.structure == "object") {
								$key
									.addClass("ecole-no-select")
									.hover(
										function (event) {
											me.highlightIn($key, [], "");
										},
										function (event) {
											me.highlightOut($key, [], "");
										}
									)
									.bind(opt.event, function (event) {
										me.updateNewKeyArrayObjectInPlace(
											null,
											function (new_key) {
												me.data = _.reduce(
													me.data,
													function (aggr, value, index) {
														if (key == index) {
															aggr[new_key] = value;
														} else {
															aggr[index] = value;
														}
														return aggr;
													},
													{}
												);
												alertMothership(me.data);
											},
											'Please choose a new key for "' + key + '":',
											key
										);
									});
							}
							me.$last_row = $row;
						});
						if (me.structure == "array") {
							me.$struct.text("[");
							me.$after.text("]");
						} else {
							me.$struct.text("{");
							me.$after.text("}");
						}
						me.$append = $("<span />")
							.text("[+]")
							.appendTo(
								$("<div />")
									.addClass("ecole-json-append")
									.insertBefore(me.$after)
							);
						me.$append
							.addClass("ecole-no-select")
							.hover(
								function (event) {
									me.highlightIn(
										me.$append,
										me.$last_row ? [me.$last_row] : [],
										"ecole-json-to-add"
									);
								},
								function (event) {
									me.highlightOut(
										me.$append,
										me.$last_row ? [me.$last_row] : [],
										"ecole-json-to-add"
									);
								}
							)
							.bind(opt.event, function (event) {
								me.updateNewKeyArrayObjectInPlace(
									function () {
										me.updatePrimitive(
											null,
											function (new_val) {
												me.data.push(new_val);
												alertMothership(me.data);
											},
											"Please choose a value to add (You can change type later):"
										);
									},
									function (new_key) {
										me.updatePrimitive(
											null,
											function (new_val) {
												me.data[new_key] = new_val;
												alertMothership(me.data);
											},
											"Please choose a value to add (You can change type later):"
										);
									}
								);
							});
					} else {
						me.type = me.getType(me.data);
						if (_.contains(["number", "string"], me.type)) {
							if (_.isString(me.data)) {
								me.$struct.text('"');
								me.$after.text('"');
							} else {
								me.$struct.text("#");
								me.$after.text("");
							}
							me.$inner.text(me.data);
							if (me.type == "string") {
								me.$inner.css({
									"font-family": "Courier",
									"white-space": "pre-wrap",
								});
							}
						} else if (me.type == "boolean") {
							me.$struct.text("?");
							me.$inner.text(me.data);
						} else {
							me.$struct.html("&empty;");
							me.$inner.html("<em>null</em>");
						}
						me.$inner
							.addClass("ecole-no-select")
							.hover(
								function (event) {
									me.highlightIn(me.$inner, [], "");
								},
								function (event) {
									me.highlightOut(me.$inner, [], "");
								}
							)
							.bind(opt.event, function (event) {
								me.updatePrimitive(me.data, function (data2) {
									if (me.data !== data2) {
										me.data = data2;
										alertMothership(data2);
									}
								});
							});
					}
					if (!me.$after.text()) {
						me.$after.hide();
					}
				},
			};

			me.load();
			if (editStructure) {
				me.$struct
					.addClass("ecole-no-select")
					.hover(
						function (event) {
							me.highlightIn(me.$struct, [], "");
						},
						function (event) {
							me.highlightOut(me.$struct, [], "");
						}
					)
					.bind(opt.event, function (event) {
						me.updateStructure(me.data, function (data2) {
							if (me.data !== data2) {
								me.data = data2;
								alertMothership(data2);
							}
						});
					});
			}
		};

		var render = function (data) {
			var $outer = $("<div />").addClass("ecole-json-outer");
			var $controls = $("<div />").addClass("ecole-json-controls");
			opt.$display.html("").append($outer);
			opt.renderHelper(
				opt.$display,
				data,
				_.contains(["object", "array"], opt.type),
				render
			);
			if (JSON.stringify(data) === JSON.stringify(opt.data)) {
				opt.$display.removeClass("edited");
			} else {
				opt.$display.addClass("edited");
				opt.$display.append($controls);
				$("<a />")
					.addClass("btn btn-primary cancel")
					.text("Cancel")
					.click(function () {
						AoPS.Ui.Modal.showConfirm(
							"Are you sure? Your changes will not be saved.",
							function (ok) {
								if (ok) {
									Utils.ScrollToVisible(opt.$display, function () {
										render(opt.data);
									});
								}
							},
							{
								confirm_button_ok: "Yes",
								confirm_button_cancel: "No",
							}
						);
					})
					.appendTo($controls);
				$("<a />")
					.addClass("btn btn-primary")
					.text("Save")
					.click(function () {
						Utils.CreateModalConfirm(
							"Are you sure you want to save?",
							function () {
								Utils.ScrollToVisible(opt.$display, function () {
									opt.save(JSON.stringify(data));
								});
							},
							null,
							{
								confirm_button_ok: "Yes",
								confirm_button_cancel: "No",
							}
						);
					})
					.appendTo($controls);
			}
		};
		render(opt.data);
		$el.html("").append(opt.$display.show()).append(opt.$edit.hide());
	};

	Utils.CreateEditableTextArea = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		$el.addClass("ecole-no-select");
		$el.html($el.html().trim() || $("<div />").text(opt.data).html().trim());
		$el
			.hover(function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					$el.addClass("ecole-clickable");
					$el.editable("enable");
				} else {
					$el.removeClass("ecole-clickable");
					$el.editable("disable");
				}
			})
			.editable(opt.save, {
				type: "textarea",
				data: opt.data,
				event: opt.event,
				placeholder: opt.placeholder,
				tooltip: opt.tooltip,
				height: opt.height || "7em",
				select: true,
				onblur: "submit",
			});
	};

	Utils.CreateEditableSave = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		$el.addClass("ecole-no-select");
		$el.html($el.html().trim() || $("<div />").text(opt.data).html().trim());
		$el
			.hover(function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					$el.addClass("ecole-clickable");
					$el.editable("enable");
				} else {
					$el.removeClass("ecole-clickable");
					$el.editable("disable");
				}
			})
			.bind(opt.event, function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					if (_.isFunction(opt.save)) {
						opt.save($el.data);
					}
				}
			});
	};

	Utils.EditableHelperCreateDisplay = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt.$display = $("<div />").addClass("ecole-no-select");
		opt.$display.html(
			$el.html().trim() ||
				$("<div />").text(opt.data).html().trim() ||
				opt.placeholder.trim() ||
				"&nbsp;"
		);
		if (opt.tooltip) {
			opt.$display.attr("title", opt.title);
		}
		opt.$display
			.hover(function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					opt.$display.addClass("ecole-clickable");
				} else {
					opt.$display.removeClass("ecole-clickable");
				}
			})
			.bind(opt.event, function (event) {
				if (!_.isFunction(opt.enabled) || opt.enabled($el)) {
					opt.$display.hide();
					opt.$edit.show().select().focus();
				}
			});
		opt.$edit = $("<input />")
			.attr({type: "text"})
			.css("width", opt.width)
			.val(opt.default);
		return opt;
	};

	Utils.CreateEditableDate = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		opt = Utils.EditableHelperCreateDisplay($el, opt);

		opt.$edit.attr({size: 8});
		if (!opt.empty && !opt.typable) {
			opt.$edit.attr({readonly: true});
		}
		opt.$edit.val(opt.data || opt.default).datepicker({
			constrainInputType: true,
			beforeShowDay:
				opt.show ||
				function (date) {
					return [true, "", ""];
				},
			dateFormat: "yy/mm/dd",
			onClose: function (date) {
				opt.$edit.hide();
				opt.$display.show();
			},
			onSelect: function (val) {
				opt.save(val, opt.$edit);
			},
		});
		$el.html("").append(opt.$display.show()).append(opt.$edit.hide());
	};

	// Requires jquery-ui-timepicker-addon.js
	Utils.CreateEditableTime = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		opt = Utils.EditableHelperCreateDisplay($el, opt);

		opt.$edit
			.attr({size: 8, readonly: true})
			.val(opt.data || opt.default)
			.timepicker({
				constrainInputType: true,
				controlType: "slider",
				dateFormat: "yy-mm-dd",
				timeFormat: "h:mm tt",
				stepMinute: 15,
				showSecond: false,
				onClose: function (val) {
					opt.save(val, opt.$edit);
				},
				onSelect: function () {},
			});
		$el.html("").append(opt.$display.show()).append(opt.$edit.hide());
	};

	Utils.CreateEditableUser = function ($el, opt) {
		if ($el.length <= 0) {
			return;
		}

		opt = Utils.EditableHelper($el, opt);
		opt = Utils.EditableHelperCreateDisplay($el, opt);

		if (opt.extend !== undefined && opt.extend) {
			opt.source.unshift(opt.extend);
		}
		opt.$edit
			.attr({size: 12})
			.aopsAutocomplete({
				source: opt.source,
				minLength: 1,
				onSelect: _.bind(function (event, ui) {
					event.stopPropagation();
					event.preventDefault();
					if (_.isFunction(opt.save)) {
						opt.save(ui.item.user_id);
						opt.$edit.val("").hide();
						opt.$display.show();
					}
					return false;
				}, this),
			})
			.blur(function () {
				opt.$edit.hide();
				opt.$display.show();
			});

		$el.html("").append(opt.$display.show()).append(opt.$edit.hide());
	};

	Utils.CreateUserAutocomplete = function ($el, select) {
		if ($el.length <= 0) {
			return;
		}

		$el.aopsAutocomplete({
			source: function (request, response) {
				$.ajax({
					method: "post",
					url: "/xo/ajax.php",
					data: {
						a: "find_user_autocomplete",
						term: request.term,
					},
				})
					.done(function (data) {
						if (!data.error_code && !data.error_msg) {
							response(data.response.matches);
						} else {
							response([]);
						}
					})
					.fail(function () {
						response([]);
					});
			},
			minLength: 1,
			onSelect: _.bind(function (event, ui) {
				event.stopPropagation();
				event.preventDefault();
				if (_.isFunction(select)) {
					select(ui.item);
				}
				return false;
			}, this),
		});
	};

	/**
	 * Converts an HSV color value to RGB. Conversion formula
	 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
	 * Assumes h, s, and v are contained in the set [0, 1] and
	 * returns r, g, and b in the set [0, 255].
	 *
	 * @param   Number  h     The hue
	 * @param   Number  s     The saturation
	 * @param   Number  v     The value
	 * @return  Array       The RGB representation
	 */
	Utils.hsvToRgb = function (h, s, v) {
		var r, g, b;

		var i = Math.floor(h * 6);
		var f = h * 6 - i;
		var p = v * (1 - s);
		var q = v * (1 - f * s);
		var t = v * (1 - (1 - f) * s);

		switch (i % 6) {
			case 0:
				r = v;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = v;
				b = p;
				break;
			case 2:
				r = p;
				g = v;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = v;
				break;
			case 4:
				r = t;
				g = p;
				b = v;
				break;
			case 5:
				r = v;
				g = p;
				b = q;
				break;
		}

		return [r, g, b];
	};

	Utils.rgbToHex = function (r, g, b) {
		var toHex = function (x) {
			var hex = Math.max(0, Math.min(255, Math.floor(256 * x))).toString(16);
			return ("00" + hex).slice(-2);
		};
		return toHex(r) + toHex(g) + toHex(b);
	};

	Utils.hsvToHex = function (h, s, v) {
		var rgb = Utils.hsvToRgb(h, s, v);
		return Utils.rgbToHex(rgb[0], rgb[1], rgb[2]);
	};

	Utils.banOrUnban = function (options) {
		var inner = function (response) {
			var $el = $("<div />").css({
				margin: "0px 10px",
				"text-align": "left",
				"max-width": "800px",
			});

			var unbanTxt = options.class_id
				? "UNBAN FROM THIS CLASS"
				: "UNBAN FROM ALL CLASSES";

			var $textComment = $("<textarea />").css({
				width: "100%",
				resize: "none",
				height: "10em",
			});
			var $textMessage = $("<textarea />").css({
				width: "100%",
				resize: "none",
				height: "12em",
			});
			var $selTemplates = $("<select />");
			var $chkClassOnly = $("<input />")
				.attr({type: "checkbox", id: "class-only"})
				.css({"margin-right": "5px"})
				.change(function (event) {
					if (event.currentTarget.checked) {
						$confirm.text("BAN FROM THIS CLASS");
					} else {
						$confirm.text("BAN FROM ALL CLASSES");
					}
				});

			var $confirm = $("<a />")
				.addClass("btn btn-primary")
				.attr({id: "ban-btn"})
				.text(options.is_bant ? unbanTxt : "BAN FROM ALL CLASSES");

			var $affirm = $("<a />")
				.addClass("btn btn-primary")
				.text("SAVE COMMENT & MESSAGE");
			var $cancel = $("<a />").addClass("btn btn-primary").text("CANCEL");
			var $table = $("<table />").css({
				width: "100%",
				"table-layout": "fixed",
				margin: "10px 0",
			});
			var $trow = $("<tr />").appendTo($table);
			var currentTemplate = null;

			$el.append(
				$("<p />").text(
					"Please enter a reason for why you would like to " +
						(options.is_bant ? "unban" : "ban") +
						" " +
						options.name +
						" " +
						"from answering graded homework problems (internal use only):"
				)
			);

			$el.append($textComment);
			if (!options.is_bant && options.class_id) {
				$el.append(
					$("<p />")
						.css({"text-align": "right"})
						.append(
							$("<label />")
								.append($chkClassOnly)
								.append("Ban user for this class ID only.")
						)
				);
			}

			// Now we do the student facing bit
			var populateTextFromTemplate = function () {
				var template = _.findWhere(response.templates, {
					template: currentTemplate,
				});
				if (template) {
					$textMessage.val(template.text);
				}
			};

			_.each(response.templates, function (template) {
				$selTemplates.append(
					$("<option />")
						.attr({value: template.template})
						.text(template.template)
				);
			});
			currentTemplate = $selTemplates.find(":selected").val();
			populateTextFromTemplate();
			$selTemplates.change(function () {
				var currentText =
					(
						_.findWhere(response.templates, {
							template: currentTemplate,
						}) || {}
					).text || "";
				var newTemplate = $selTemplates.find("option:selected").val();
				if (currentText == $textMessage.val()) {
					currentTemplate = newTemplate;
					populateTextFromTemplate();
				} else {
					Utils.CreateModalConfirm(
						"Are you sure you want to replace your message with another template?",
						function () {
							currentTemplate = newTemplate;
							populateTextFromTemplate();
						},
						function () {
							$selTemplates
								.find('option[value="' + currentTemplate + '"]')
								.prop("selected", true);
						}
					);
				}
			});

			if (!options.is_bant) {
				$el.append(
					$("<p />")
						.append($selTemplates.css({float: "right"}))
						.append(
							"Please enter the message you would like the student to see:"
						)
				);
				$el.append($textMessage);
			}

			// Now the buttons
			$el.append($table);
			$trow.append($("<td />").css({"text-align": "left"}).append($confirm));
			if (options.is_bant) {
				$trow.append($("<td />").css({"text-align": "center"}).append($affirm));
			}
			$trow.append($("<td />").css({"text-align": "right"}).append($cancel));

			if (response.notes && response.notes.length) {
				var $ul = $("<ul />").appendTo($el);
				_.each(_.sortBy(response.notes, "date"), function (note) {
					$ul.prepend(
						$("<li />")
							.css({color: note.is_active ? "red" : "black"})
							.text(
								(note.username || note.user_id.toString()) +
									" @ " +
									note.date +
									": " +
									note.comment
							)
					);
				});
			}

			var modal = $el.showPlainModal({
				title: $("<h3 />")
					.text((options.is_bant ? "Unban" : "Ban") + " " + options.name)
					.css({margin: "0", color: "white"}),
			});
			$textComment.focus();

			$cancel.click(function (e) {
				e.preventDefault();
				if ($textComment.val().length) {
					Utils.CreateModalConfirm(
						"Are you sure you want to cancel?",
						function () {
							AoPS.Ui.Modal.removeModal(modal);
						}
					);
				} else {
					AoPS.Ui.Modal.removeModal(modal);
				}
			});

			var stuff = [
				{$button: $confirm, ban: options.is_bant ? 0 : 1, affirm: 0},
				{$button: $affirm, ban: 0, affirm: 1},
			];
			_.each(stuff, function (iter) {
				iter.$button.click(function (e) {
					e.preventDefault();
					if ((iter.ban || iter.affirm) && $textMessage.val().length == 0) {
						populateTextFromTemplate();
						Utils.CreateModalAlert(
							"Please enter a message for the student.",
							function () {
								$textMessage.focus();
							}
						);
					} else if ($textComment.val().length) {
						var confirm = function () {
							var wait_modal = Utils.CreateModalInescapable();
							$.ajax({
								method: "post",
								url: "/xo/ajax.php",
								data: {
									a: "ban_or_unban_user",
									user_id: options.user_id,
									class_id:
										iter.ban && !$chkClassOnly.prop("checked")
											? 0
											: options.class_id,
									ban: iter.affirm || iter.ban ? 1 : 0,
									message: $textMessage.val(),
									comment: $textComment.val(),
								},
							}).done(function (data) {
								AoPS.Ui.Modal.removeModal(wait_modal);
								if (!data.error_code && !data.error_msg) {
									AoPS.Ui.Modal.removeModal(modal);
									if (_.isFunction(options.success)) {
										options.success(data);
									}
								} else {
									Utils.CreateModalAlert(
										data.error_msg
											? data.error_msg
											: "Unknown Error. Please try again."
									);
								}
							});
						};

						if (iter.affirm) {
							Utils.CreateModalConfirm(
								"Are you sure you want to save this comment? This will not ban or unban " +
									options.name +
									".",
								confirm
							);
						} else {
							Utils.CreateModalConfirm(
								"Are you sure you want to " +
									(iter.ban ? "ban" : "unban") +
									" " +
									options.name +
									"?",
								confirm
							);
						}
					} else {
						Utils.CreateModalAlert("Please enter a reason.", function () {
							$textComment.focus();
						});
					}
				});
			});
		};

		var load_modal = Utils.CreateModalInescapable();
		$.ajax({
			method: "post",
			url: "/xo/ajax.php",
			data: {
				a: "get_bant_notes",
				user_id: options.user_id,
				class_id: options.class_id,
			},
		}).done(function (data) {
			AoPS.Ui.Modal.removeModal(load_modal);
			if (!data.error_code && !data.error_msg) {
				options.name = data.response.username + " (" + options.user_id + ")";
				inner(data.response);
			} else {
				Utils.CreateModalAlert(
					data.error_msg ? data.error_msg : "Unknown Error. Please try again."
				);
			}
		});
	};

	Utils.resetCryptGridHomeworkForUser = function (options) {
		var inner = function (response) {
			var htmlYes = '<span style="color:green" class="aops-font">q</span>';
			var htmlNo = '<span style="color:red" class="aops-font">J</span>';

			var $el = $("<div />").css({
				margin: "0px 10px",
				"text-align": "left",
				"max-width": "800px",
			});
			var $table = $("<table />").addClass("aops").css({width: "100%"});
			var $thead = $("<thead />").appendTo($table);
			var $tbody = $("<tbody />").appendTo($table);
			var $checkbox = $("<th />")
				.addClass("ecole-clickable check")
				.css({"text-align": "center"})
				.html(htmlNo);
			var $reset = $("<a />")
				.addClass("btn btn-primary reset")
				.text("RESET PROBLEMS");

			$thead.append(
				$("<tr />")
					.append($checkbox.css({width: "2.5em"}))
					.append($("<th />").text("Lesson"))
					.append($("<th />").text("ID"))
					.append($("<th />").text("Problem"))
					.append($("<th />").text("Type"))
					.append($("<th />").text("Released?"))
					.append($("<th />").text("Answered?"))
					.append($("<th />").text("Viewed?"))
			);
			_.each(response.hw, function (row) {
				var $tr = $("<tr />")
					.addClass("lesson-" + row.lesson)
					.appendTo($tbody)
					.attr({problem_id: row.problem_id});
				var $check = $("<td />")
					.addClass("check")
					.css({"text-align": "center"})
					.html(htmlNo);

				$tr.append($check);
				$tr.append(
					$("<td />")
						.css({"text-align": "center"})
						.addClass("lesson")
						.text(row.lesson)
				);
				$tr.append($("<td />").text(row.problem_id));
				$tr.append($("<td />").text(row.markup));
				$tr.append($("<td />").text(row.problem_type_name));
				$tr.append($("<td />").text(row.released_at ? "Yes" : "No"));
				$tr.append(
					$("<td />").html(
						row.answered_at ? '<b style="color:darkred">Yes</b>' : "No"
					)
				);
				$tr.append(
					$("<td />").html(
						row.solution_viewed_at ? '<b style="color:darkred">Yes</b>' : "No"
					)
				);

				_.each($tr.find("td"), function (td) {
					var $td = $(td);
					$td
						.css({cursor: "pointer"})
						.click(function (e) {
							if ($td.hasClass("lesson")) {
								var num_boxes = $tbody.find(
									"tr.lesson-" + row.lesson + " td.check"
								).length;
								var num_selected = $tbody.find(
									"tr.lesson-" + row.lesson + " td.check.yes"
								).length;
								if (num_selected * 2 >= num_boxes) {
									$tbody
										.find("tr.lesson-" + row.lesson + " td.check")
										.html(htmlNo)
										.removeClass("yes");
								} else {
									$tbody
										.find("tr.lesson-" + row.lesson + " td.check")
										.html(htmlYes)
										.addClass("yes");
								}
							} else {
								if ($check.hasClass("yes")) {
									$check.html(htmlNo).removeClass("yes");
									$checkbox.html(htmlNo).removeClass("yes");
								} else {
									$check.html(htmlYes).addClass("yes");
								}
							}
						})
						.hover(
							function () {
								if ($td.hasClass("lesson")) {
									$tbody.find("tr.lesson-" + row.lesson + " td").css({
										background: "rgba(255,0,0,0.15)",
									});
								} else {
									$tr.find("td").css({
										background: "rgba(255,0,0,0.15)",
									});
								}
							},
							function () {
								if ($td.hasClass("lesson")) {
									$tbody
										.find("tr.lesson-" + row.lesson + " td")
										.css({background: "inherit"});
								} else {
									$tr.find("td").css({background: "inherit"});
								}
							}
						);
				});
			});

			$checkbox
				.css({cursor: "pointer"})
				.click(function (e) {
					var num_boxes = $tbody.find("tr td.check").length;
					var num_selected = $tbody.find("tr td.check.yes").length;
					if (num_selected * 2 >= num_boxes) {
						$table
							.find("tr td.check, tr th.check")
							.html(htmlNo)
							.removeClass("yes");
					} else {
						$table
							.find("tr td.check, tr th.check")
							.html(htmlYes)
							.addClass("yes");
					}
				})
				.hover(
					function () {
						$tbody.find("tr td").css({background: "rgba(255,0,0,0.15)"});
					},
					function () {
						$tbody.find("tr td").css({background: "inherit"});
					}
				);

			$el.append(
				$("<p />").text(
					"Select which problems you want to reset for " + options.name + ":"
				)
			);
			$el.append($("<p />").append($reset));
			$el.append($table);
			$el.append($("<p />").append($reset.clone()));

			$el.find(".btn.reset").click(function (e) {
				e.preventDefault();
				var problem_ids = [];
				_.each($tbody.find("tr"), function (tr) {
					if ($(tr).find("td.check.yes").length) {
						problem_ids.push(parseInt($(tr).attr("problem_id")));
					}
				});

				if (problem_ids.length) {
					var confirm = function () {
						var wait_modal = Utils.CreateModalInescapable();
						$.ajax({
							method: "post",
							url: "/xo/ajax.php",
							data: {
								a: "get_crypt_grid_homework_for_user",
								user_id: options.user_id,
								class_id: options.class_id,
								reset: 1,
								problem_ids: problem_ids,
							},
						}).done(function (data) {
							AoPS.Ui.Modal.removeModal(wait_modal);
							if (!data.error_code && !data.error_msg) {
								AoPS.Ui.Modal.removeModal(modal);
								if (_.isFunction(options.success)) {
									options.success(data);
								}
							} else {
								Utils.CreateModalAlert(
									data.error_msg
										? data.error_msg
										: "Unknown Error. Please try again."
								);
							}
						});
					};

					Utils.CreateModalConfirm(
						"Are you sure you want to reset these problems for " +
							options.name +
							"? This is irreversible.",
						confirm
					);
				} else {
					Utils.CreateModalAlert("Please select problems to reset.");
				}
			});

			var modal = $el.showPlainModal({
				title: $("<h3 />")
					.text("Reset Homework for " + options.name)
					.css({margin: "0"}),
				scrollable: true,
			});
		};

		var load_modal = Utils.CreateModalInescapable();
		$.ajax({
			method: "post",
			url: "/xo/ajax.php",
			data: {
				a: "get_crypt_grid_homework_for_user",
				user_id: options.user_id,
				class_id: options.class_id,
			},
		}).done(function (data) {
			AoPS.Ui.Modal.removeModal(load_modal);
			if (!data.error_code && !data.error_msg) {
				options.name = data.response.username + " (" + options.user_id + ")";
				inner(data.response);
			} else {
				Utils.CreateModalAlert(
					data.error_msg ? data.error_msg : "Unknown Error. Please try again."
				);
			}
		});
	};

	Utils.RenderPythonWindow = async function ($container, options) {
		if (!($container instanceof jQuery)) {
			return;
		}

		options = _.extend(
			{
				messageText: $container.text(),
				canEdit: false,
				canExecute: true,
				canReset: true,
			},
			options
		);

		var pyMessage = Utils.PythonMarkupTools.processPythonTagFromMessageText(
			options.messageText.replace(/\u00a0/g, " "),
			{postProcess: true}
		);

		if ((pyMessage || {}).tag) {
			var motorArgs = {
				language: "python",
				minEditorLines: 1,
				maxEditorLines: 20,
				maxIoHeight: "360px",
				files: pyMessage.files,
				editorText: pyMessage.body,
				bypassModals: true,
				canEdit: options.canEdit && pyMessage.tag.toLowerCase() !== "pymarkup",
				canExecute:
					options.canExecute && pyMessage.tag.toLowerCase() !== "pymarkup",
			};

			_.each(pyMessage.commands, function (command) {
				var args = command.args;
				switch (command.type.toLowerCase()) {
					case "canEdit".toLowerCase():
						motorArgs.canEdit =
							options.canEdit &&
							(args[0] && args[0] === "false" ? false : true);
						break;

					case "canExecute".toLowerCase():
						motorArgs.canExecute =
							options.canExecute &&
							(args[0] && args[0] === "false" ? false : true);
						break;

					case "canReset".toLowerCase():
						motorArgs.canReset =
							options.canReset &&
							(args[0] && args[0] === "false" ? false : true);
						break;

					case "minEditorLines".toLowerCase():
						if (args[0] && parseInt(args[0])) {
							motorArgs.minEditorLines = parseInt(args[0]);
						}
						break;

					case "maxEditorLines".toLowerCase():
						if (args[0] && parseInt(args[0])) {
							motorArgs.maxEditorLines = parseInt(args[0]);
						}
						break;

					case "outputLimit".toLowerCase():
						if (args[0] && parseInt(args[0])) {
							motorArgs.outputLimit = parseInt(args[0]);
						}
						break;

					case "minIoHeight".toLowerCase():
						if (args[0]) {
							motorArgs.minIoHeight = args[0];
						}
						break;

					case "maxIoHeight".toLowerCase():
						if (args[0]) {
							motorArgs.maxIoHeight = args[0];
						}
						break;

					case "canvasHeight".toLowerCase():
						if (args[0]) {
							motorArgs.canvasHeight = args[0];
						}
						break;

					case "canvasWidth".toLowerCase():
						if (args[0]) {
							motorArgs.canvasWidth = args[0];
						}
						break;
				}
			});

			var staticView = await AoPS.Motors.Utils.generateStaticMotor({
				type: "CodeWindow",
				options: motorArgs,
				resolveListener: function (output, driver) {
					if (output.command) {
						switch ((output.command || {}).type || "") {
							case "openResetDialog":
								Utils.CreateModalConfirm(
									$("<div />")
										.append(
											$("<p />").text(
												"Do you really want to reset this Python window?"
											)
										)
										.append(
											$("<p />").text(
												"Any changes that you have made will be lost."
											)
										),
									function () {
										driver.outputs.sendData({command: {type: "reset"}});
									}
								);
								break;

							case "openFile":
								var data = (output.command || {}).data || {};
								var file = {
									name: data.name || "",
									data: data.data || "",
									encoding: data.encoding || "",
								};

								Utils.CreateModalAlert(
									$("<div />")
										.append(
											$("<p />")
												.text("Viewing ")
												.append($("<b />").text(file.name))
												.append(
													":" +
														(file.encoding === "base64" ? " (Binary File)" : "")
												)
										)
										.append(
											$("<textarea />")
												.css({
													width: "100%",
													"min-width": "480px",
													height: "240px",
													"font-family": "monospace",
													whitespace: "pre-wrap",
												})
												.attr("readonly", 1)
												.text(file.data)
										)
								);
								break;
						}
					}
				},
			});

			Motors.render(staticView, $container.empty().get(0));
		}
	};

	// adapted from similar classroom6 script.
	Utils.PythonMarkupTools = {
		allValidPythonTags: ["pymarkup", "python", "pywindow"],
		usesPythonWindow: function (messageText, options) {
			var tagStyles = (options || {}).tagStyles || ["slash"];

			return _.reduce(
				Utils.PythonMarkupTools.allValidPythonTags,
				function (carry, tag) {
					return (
						carry ||
						_.reduce(
							tagStyles,
							function (styleCarry, tagStyle) {
								var regExp =
									Utils.PythonMarkupTools.createRegExpForTagAndTagStyle(
										tag,
										tagStyle
									);

								if (styleCarry) {
									return styleCarry;
								}

								return regExp && regExp.test(messageText) ? true : false;
							},
							carry
						)
					);
				},
				false
			);
		},
		processPythonTagFromMessageText: function (messageText, options) {
			var tagStyles = (options || {}).tagStyles || ["slash"];
			var output = _.reduce(
				Utils.PythonMarkupTools.allValidPythonTags,
				function (carry, tag) {
					return (
						carry ||
						_.reduce(
							tagStyles,
							function (styleCarry, tagStyle) {
								if (!styleCarry) {
									var regExp =
										Utils.PythonMarkupTools.createRegExpForTagAndTagStyle(
											tag,
											tagStyle
										);
									if (regExp) {
										var match = messageText.match(regExp) || [];

										if (match.length) {
											var capture = match[1] || "";
											var whitespace = match[2] || "";

											if (whitespace.match(/\n/)) {
												// Hooray, we have our own line. Let's kill the first line.
												return {
													tag: tag,
													body: capture
														.replace(/^([ \t]*\n)+/, "")
														.replace(/\s+$/, ""),
												};
											} else {
												// Otherwise, remove space between tag declaration and the code.
												return {
													tag: tag,
													body: capture.trim(),
												};
											}
										}
									}
								}
								return styleCarry;
							},
							carry
						)
					);
				},
				null
			);
			if (output && (options || {}).postProcess) {
				return Utils.PythonMarkupTools.processPythonShebangAndFiles(output);
			} else {
				return output;
			}
		},
		processPythonShebangAndFiles: function (input) {
			var output = {
				tag: input.tag,
				body: input.body,
				commands: (input.commands || []).slice(0),
				files: (input.files || []).slice(0),
			};

			var pythonShebangMatches =
				output.body.match(/^#!pywindow\s+[\s\S]*?(\n|$)/gim) || [];

			var pyfileMatches =
				output.body.match(
					/\[\s*pyfile\s*=\s*['"].+?['"]\s*\][\s\S]*?\[\s*\/pyfile\s*\]/gi
				) || [];

			_.each(pythonShebangMatches, function (matched) {
				var tokens = matched.split(/\s+/).slice(1);
				var command = tokens[0] || "";
				var args = tokens.slice(1) || [];
				output.commands = (output.commands || []).concat([
					args.length ? {type: command, args: args} : {type: command},
				]);
				output.body = output.body.replace(matched, "");
			});

			_.each(pyfileMatches, function (matched) {
				var captured =
					matched.match(
						/\[\s*pyfile\s*=\s*['"](.+?)['"]\s*\]([\s\S]*?)\[\s*\/pyfile\s*\]/i
					) || [];

				if (captured.length === 3) {
					output.files = (output.files || []).concat([
						{
							name: captured[1],
							data: captured[2],
							encoding: "standard",
						},
					]);
					output.body = output.body.replace(matched, "");
				}
			});

			output.body = output.body.replace(/^([ \t]*\n)+/, "").replace(/\s+$/, "");

			return output;
		},
		outputTextFromPythonParsedMessage: function (input, options) {
			var outputTagStyle = (options || {}).tagStyle || "slash";
			var tagStartAndEnd =
				Utils.PythonMarkupTools.createStartAndEndForTagAndTagStyle(
					input.tag,
					outputTagStyle
				);
			var output = "";

			if (_.isUndefined(input.commands) || _.isUndefined(input.files)) {
				input = Utils.PythonMarkupTools.processPythonShebangAndFiles(input);
			}

			// Start Tag
			if (tagStartAndEnd) {
				output = tagStartAndEnd.start + "\n";
			}

			// Include files
			output += _.map(input.files || [], function (file) {
				return '[pyfile="' + file.name + '"]' + file.data + "[/pyfile]";
			}).join("");

			// Include shebang commands
			if ((options || {}).excludeCommands !== "all") {
				var excludeCommands = _.map(
					_.isArray((options || {}).excludeCommands)
						? (options || {}).excludeCommands
						: [],
					function (str) {
						return str.toLowerCase();
					}
				);

				output += _.map(
					_.filter(input.commands || [], function (command) {
						return excludeCommands.indexOf(command.type.toLowerCase()) < 0;
					}),
					function (command) {
						return ["#!pywindow", command.type]
							.concat(command.args || [])
							.join(" ");
					}
				).join("\n");
			}

			// Now append code, get rid of trailing spaces before putting on the ending.
			return (
				(output + "\n" + input.body).trim() + ((tagStartAndEnd || {}).end || "")
			);
		},
		createRegExpForTagAndTagStyle: function (tag, tagStyle) {
			switch (tagStyle) {
				case "slash":
					return new RegExp("^\\/" + tag + "((\\s*)[\\s\\S]*|$)", "i");

				case "semicolon":
					return new RegExp("^;" + tag + "((\\s*)[\\s\\S]*|$)", "i");

				case "bbcode":
					return new RegExp(
						"^\\[" + tag + "\\]((\\s*)[\\s\\S]*?)\\[\\/" + tag + "\\]",
						"i"
					);
			}

			return null;
		},
		createStartAndEndForTagAndTagStyle: function (tag, tagStyle) {
			switch (tagStyle) {
				case "slash":
					return {start: "/" + tag};

				case "semicolon":
					return {start: ";" + tag};

				case "bbcode":
					return {start: "[" + tag + "]", end: "[/" + tag + "]"};
			}

			return null;
		},
	};

	return Utils;
})(AoPS.Ecole.Utils);

/* eslint-enable eqeqeq */
