(function (document) {
    "use strict";

    var config_default  = {
             "filter_switch":   false
            ,"show_reposts":    false
            ,"show_groups":     false
            ,"show_ig":         true
            ,"show_friends":    true
            ,"show_adv":        false
            ,"show_adv_left":   false
            ,"search_text":     ''
            ,"hide_re":         []
            ,"likes_filter":    false
            ,"likes_filter_op": 'gt'
            ,"min_likes":       0
            ,"debug_mode":      false
        }
        ,config         = config_default
        ,config_on_change    = function(changes, area_name) {
            debug("config on change event:", changes, area_name);
            for(var key in changes) {
                config[key] = changes[key].newValue;
            }
            debug('config changed', config);
        }
        ,config_init    = function() {
            if(chrome.storage) {
                chrome.storage.sync.get(
                    config_default
                    ,function(items) {
                        for(var key in items) {
                            config[key] = items[key];
                        }
                        debug('config initialized', config);
                    }
                );
                chrome.storage.onChanged.addListener(config_on_change);
            }
        }
        ,getTime        = function() { return (new Date()).getTime() }
        ,time_filter    = null
        ,debug          = function() {
            // config can be initialized later than first call here
            // possible problem: unshown first debug calls
            if(config.debug_mode) console.log.apply(console, arguments);
        }
        ,error          = function() {
            // config can be initialized later than first call here
            // possible problem: unshown first debug calls
            if(config.debug_mode) console.log.apply(console, ["[ERROR]"].concat(arguments));
        }
        ,POST_REPOST            = 'post_repost'
        ,POST_GROUP             = 'post_group'
        ,POST_IG                = 'post_ig'
        ,POST_FRIENDS           = 'post_friends'
        ,POST_ADV               = 'post_adv'
        ,HIDE_RE                = 'hide_re'
        ,SEARCH_TEXT_MISMATCH   = 'search_text_mismatch'
        ,post_type      = function(idx, el) {
            var el_jq = jQuery(el);
            if(
                0 < el_jq.find('.published_by_wrap').length
                ||
                0 < el_jq.find('div[id^=feed_repost]').length
                ||
                0 < el_jq.find('div[class^=feed_repost]').length
            ) {
                debug('post repost');
                return POST_REPOST;
            }

            if(config.search_text && config.search_text.length) {
                var suits   = false;
                try {
                    var re  = new RegExp( config.search_text, "i" );
                    suits   = el_jq.text().match(re);
                }
                catch(e) {
                    error("can't check "+config.search_text+" for search_text:", e);
                }

                if(!suits) {
                    debug("post search text mismatch");
                    return SEARCH_TEXT_MISMATCH;
                }
            }

            if(config.hide_re) {
                var hide_re  = [];
                if(jQuery.isArray(config.hide_re)) {
                    hide_re  = config.hide_re;
                }
                else if(
                    undefined !== config.hide_re
                    &&
                    null !== config.hide_re
                    &&
                    '' !== config.hide_re
                ) {
                    hide_re  = [config.hide_re];
                }
                else {
                    hide_re  = [];
                }
                for(var i=0; i<hide_re.length; i++) {
                    var suits   = false;
                    try {
                        if(hide_re[i] && hide_re[i].length) {
                            var re  = new RegExp( hide_re[i], "i" );
                            suits   = el_jq.text().match(re);
                        }
                    }
                    catch(e) {
                        error("can't check "+i+"th hide_re:", e);
                    }

                    if(suits) {
                        debug("post re");
                        return HIDE_RE;
                    }
                }
            }

            // we don't have any special info on instagram
            /*
            // one more way based on negative group's id
            if(
                el_jq.find('a').toArray()
                // check if we have element, that hasClass for instagram
                .reduce(
                    function(prev, curr) {
                        return prev ? prev
                            : jQuery(curr).hasClass("wall_post_source_instagram") ? true : false
                    }
                    ,false
                )
            ) {
                debug('post ig');
                return POST_IG;
            }
            */

            // it doesn't work anymore
            /*
				1. example:
				<span class="explain"><span class="wall_text_name_explain_promoted_post" onmouseover="showTooltip(this, {text: &quot;<div class=\&quot;content\&quot;><span class=\&quot;header\&quot;>Рекламная запись<\/span><br>Эта запись добавлена в новостную ленту на основе Ваших интересов и информации из профиля.<\/div>&quot;, slide: 15, shift: [50, 0, 0], showdt: 400, hidedt: 200, className: 'wall_tt promoted_post_tt', hasover: true});">Рекламная запись</span></span>

				2. restricted:
				<div class="post_header">
					<a class="post_image" href="/nskroof">
						<img src="https://pp.vk.me/c630318/v630318525/46754/fkzbB57sPHA.jpg" data-post-id="-72326894_3846" width="50" height="50" class="post_img">
						<span class="blind_label">.</span>
					</a>
					<div class="post_header_info">
						<h5 class="post_author"><a class="author" href="/nskroof" data-from-id="-72326894" data-post-id="-72326894_3846">Свидание на крыше | Новосибирск</a> <span class="explain"><span class="wall_fixed_label">&nbsp;запись закреплена</span></span></h5>
						<div class="post_date"><a class="wall_text_name_explain_promoted_post post_link" href="/wall-72326894_3846" onclick="return showWiki({w: 'wall-72326894_3846'}, false, event);">Рекламная запись</a><span class="wall_text_name_explain_promoted_post_age_restriction">18+</span></div>
						<div class="ui_actions_menu_wrap _ui_menu_wrap " onmouseover="uiActionsMenu.show(this);" onmouseout="uiActionsMenu.hide(this);">
							<div class="ui_actions_menu_icons" tabindex="0" aria-label="Действия" role="button" onclick="uiActionsMenu.keyToggle(this, event);"><span class="blind_label">Действия</span></div>
							<div class="ui_actions_menu _ui_menu"><a class="ui_actions_menu_item" onclick="feed.ignoreItem('-72326894_3846', 'wall_-72326894_3846', '0704d6aa265bcd1891');" tabindex="0" role="link">Это не интересно</a></div>
						</div>
					</div>
				</div>

                // another case:
                <div id="ads_feed_placeholder"></div>
             */
            if(
                el_jq.find('div[class*=promoted_post]').length
                ||
                el_jq.find('div[id^=ads_]').length
            ) {
                debug('post adv');
                return POST_ADV;
            }

            var author_el       = el_jq.find('a.author').first();
            var author_id       = author_el ? jQuery(author_el).attr('data-from-id') : null;
            if(null != author_id) {
                author_id   = parseInt(author_id);
                if(NaN != author_id) {
                    // looks like persons ids are positive
                    if(0 > author_id) {
                        debug('post group');
                        return POST_GROUP;
                    }
                }
            }

            var post_el         = (el_jq.find('div.post').first())[0];
            var post_id         = post_el ? jQuery(post_el).attr('id') : null;
            if(null != post_id && post_id.match(/\-\d/)) {
                debug('post group');
                return POST_GROUP;
            }

            debug('post friends');
            return POST_FRIENDS;
        }
        ,filtered_by_likes = function(config, n_likes) {
            if(!config.likes_filter)
                return null;

            if('gt' == config.likes_filter_op) {
                return !(n_likes > config.min_likes);
            }
            return !(n_likes < config.min_likes);
        }
        ,is_post_hidden = function(idx, el, type, n_likes) {
			// hide posts which have likes less then config.filter_likes
			// no matter on news feed or group page
			// config.likes_filter - is a boolean variable,
			// that enable or disable filtering by likes count
            var filtered = filtered_by_likes(config, n_likes);
            if(null != filtered && filtered) {
                return true;
            }

            if(null === type || undefined === type)
                type = post_type(idx, el);

            // based on type only:
            switch(type) {
                case SEARCH_TEXT_MISMATCH:
                    return true;
                case HIDE_RE:
                    return true;
                case POST_REPOST:
                    return !config.show_reposts;
                case POST_GROUP:
                    return !config.show_groups;
                case POST_IG:
                    return !config.show_ig;
                case POST_FRIENDS:
                    return !config.show_friends;
                case POST_ADV:
                    return !config.show_adv;
            }

            return false;
        }
        ,is_on_screen = function(el){
			var win = jQuery(window);

			var viewport = {
				top: 	win.scrollTop()
				,left: 	win.scrollLeft()
			};
			viewport.right 	= viewport.left + win.width();
			viewport.bottom = viewport.top + win.height();

			var bounds 		= el.offset();
			bounds.right 	= bounds.left + el.outerWidth();
			bounds.bottom 	= bounds.top + el.outerHeight();

			return (!(
				viewport.right < bounds.left
                ||
                viewport.left > bounds.right
                ||
                viewport.bottom < bounds.top
                ||
                viewport.top > bounds.bottom
            ));

		}
        ,filter         = function() {
            var more_sels = [
                '#show_more_link'
                ,'#wall_more_link'
            ];
            for(var i=0; i<more_sels.length; i++) {
                var el_more = jQuery(more_sels[i]);
                if(el_more && el_more.is(':visible') && is_on_screen(el_more)) {
                    el_more.click();
                }
            }

            var filter  = false;
            filter = config.filter_switch;
            // number of selectors => to be more flexible
            var sels_posts = [ 'div.post' ];
            if(window.location.href.match("/feed")) {
                sels_posts = [ 'div.feed_row' ];
            }
            if(filter) {
                for(var i=0; i<sels_posts.length; i++) {
                    var sel_posts  = sels_posts[i];
                    /* go through all elements and show/hide (can be on options change) */
                    jQuery(sel_posts).each(function(idx, el) {
                        var el_jq   = jQuery(el);
                        var type    = post_type(idx, el_jq);

                        // count likes for easy check
                        var n_likes = 0;
                        el_jq.find('.post_like_count').each(function(idx, el) {
                            el = jQuery(el);
                            if('' != el.innerText) {
                                n_likes = parseInt(this.innerText.replace(/ /g, ''));
                                // super-defensive :)
                                if(isNaN(n_likes)) {
                                    n_likes = 0;
                                }
                            }
                        });

                        // there were checks for page ealier:
                        //
                        // but we want it not only for feed
                        // notifications are obsolete but let's leave it
                        if(
                            is_post_hidden(idx, el_jq, type, n_likes)
                            &&
                            !window.location.href.match("section=notifications")
                        ) {
                            if(el_jq.is(':visible') /*&& !is_on_screen(el_jq)*/) {
                                debug("hide element: ", el_jq);
                                el_jq.hide();
                            }
                        }
                        else {
                            if(el_jq.is(':hidden')) {
                                debug("show element: ", el_jq);
                                el_jq.show();
                            }
                        }
                    });
                }

                // hide left adv block no matter on the page
                var el_ads_left = jQuery('#ads_left');
                if(!config.show_adv_left) {
                    if(el_ads_left.is(':visible')) {
                        debug("hide left adv block");
                        el_ads_left.hide();
                    }
                }
                else {
                    if(el_ads_left.is(':hidden')) {
                        debug("show left adv block: ", el_ads_left);
                        el_ads_left.show();
                    }
                }
            }
            else {
                // show all if we switched off
                // to show again posts hidden by us
                for(var i=0; i<sels_posts.length; i++) {
                    var sel_posts  = sels_posts[i];
                    jQuery(sel_posts).each(function(idx, el) {
                        var el_jq   = jQuery(el);
                        if(el_jq.is(':hidden')) {
                            el_jq.show();
                        }
                    });
                }
            }

            time_filter = getTime();
            debug("time filter "+time_filter);
        }
        ,TIMER_DELAY                = 1000
        ,TIMER_DELAY_WAIT_FACTOR    = 0.333
    ;

    config_init();

    // filter feed on document load
    debug("initial filter call");
    filter();

    /* just re-check everything on repeat timer
     * another possible implementation:
     *   add filter() call on events:
     *   * upload more news
     *   * switch to news
     *   * keypress (to force clearance in unhandled situation)
     *   but it's too erroprone, working with timer now
     */
    var timer_filter_id = setInterval(function() {
            debug("another filter call");
            var past    = getTime() - time_filter;
            var delay   = TIMER_DELAY * TIMER_DELAY_WAIT_FACTOR;
            if(past > delay) {
                debug("past "+past+" since last filter, it's more than supposed delay "+delay+" => filter");
                filter();
            }
            else {
                debug("past "+past+" since last filter, it's less than supposed delay "+delay+" => skip filter");
            }
        }
        ,TIMER_DELAY
    );
}(document));
