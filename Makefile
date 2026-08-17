# Facade pour les commandes sans argument.
# Celles qui prennent des arguments passent par scripts/m : make les gere mal
# (`make tag reseau` traite "reseau" comme une cible a construire).

.PHONY: help check index tag

help:
	@echo 'make check              verifie la conformite (identique a la CI)'
	@echo 'make index              regenere le README'
	@echo 'make tag TAG=reseau     fiches portant ce tag'
	@echo 'make tag                vocabulaire avec le nombre de fiches par tag'
	@echo ''
	@echo 'Pour la creation de fiches, passer par scripts/m :'
	@echo '  m new <domaine> <nom>  crée une fiche, dates pre-remplies'
	@echo '  m inbox <nom>          crée une note brute dans inbox/'
	@echo '  alias m=$(CURDIR)/scripts/m'

check:
	@node scripts/index.js --check

index:
	@node scripts/index.js

tag:
	@node scripts/index.js --tag $(TAG)
