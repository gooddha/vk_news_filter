vk_news_filter
=======

Расширение для браузера googe chrome для фильтрации лент (страниц с новостями) соцсети [ВК](https://vk.com).

УСТАНОВКА
---------

Существуют 2 варианта, 1ый через гугл хранилище:
* [расширение в гугл хранилище](https://chrome.google.com/webstore/detail/новости-только-от-друзей/gfiijddehamgkgilbkfacoonhfpnmhpb)
* нажать "установить"

2ой через последнюю версию кода:
* забрать последнюю версию кода с github'а [github](https://github.com/cyga/vk_news_filter)
* отрыть расширения в хроме: [chrome://extensions](chrome://extensions)
* включить режим разработчика
* загрузить папку с расширением
* в случае самостоятельного изменения кода, обновите расширение:
  * нажать на надпись обновить (Ctrl+R) на странице [chrome://extensions](chrome://extensions)
  * обновить страницу [ВК](https://vk.com)

РАЗРЕШЕНИЯ
----------

* для страниц ВК
* для хранилища гугл - сохранение настроек

ОПИСАНИЕ
--------

В данный момент имеет следующие возможности для фильтрации:
* поиск по тексту (регулярному выражению)
* репосты (скрывать / показывать)
* посты групп (скрывать / показывать)
* посты пользователей (скрывать / показывать)
* реклама в ленте (скрывать / показывать)
* реклама в блоке слева (скрывать / показывать)
* расширяемый набор фильтров по тексту (регулярному выражению). обратное поиску действие

Фильтрует посты, по настроенным параметрам, каждую секунду.
Для настройки расширения зайдите воспользуйтесь его иконкой сверху-справа в браузере.

[Видео демонстрация](http://youtu.be/TODO).

РАЗРАБОТКА
----------

* ссылки от google:
  * [разработка расширений](https://developer.chrome.com/extensions)
  * [файл manifest.json](https://developer.chrome.com/extensions/manifest)

TODO
----

* описание
  * записать видео работы
  * добавить ссылку на видео выше
  * добавить ссылку на видео в найстройки
  * сделать новые скриншоты
* логика
  * фильтр для лайков "<=" - переключатель ">=" и ">="

РАЗРАБОТЧИКИ
------------

* [Александръ Суда Судаковъ](https://vk.com/cygakoB)
* [Adam Move Itch](https://vk.com/adam.move.itch)

Фильтруй свой ВК! :)
