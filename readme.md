## Mini Doc
Ouai ici j'vais vous expliquer rapidement les fonctions, leurs paramètres et comment ça fonctionne en gros.
Ici mon objectif était de générer **un bruit avec des valeurs allants de 0 à 1**.
Le bruit aussi est définie sur une surface de 1/1. 

### new PerlinNoise(depth,freq, ampl, seed)
Bon en gros c'est pour construire un objet de bruit de Perlin. 
Il a 4 paramètres que j'vais détailler :
**depth**(number) : C'est le niveau de détails du bruit. En gros, plus y'a de "profondeur" et plus on applique des couches de bruit.
Valeur par défaut à 4.
**freq**(number) : Ça aussi on pourrai dire que ça contrôle le niveau de détails. En fait c'est la découpe en sections/cellule de notre bruit. Plus grand est ce nombre, et plus petites seront les cellules et donc le bruit plus "serré". À chaque couche il est multiplier par 2 automatiquement.
Valeur par défaut à 4. 
**ampl**(float) : C'est l'amplitude de base du bruit. Il définie la "hauteur" des vagues générée. À chaque couche, il est divisé par 2.
Valeur par défaut à 0.5
**seed**(number) : Pour le moment non fonctionnel, mon objectif est de pouvoir controller le bruit à partir d'une graine d'aléatoire. Actuellement, le bruit est controllé par une simple opération de 'Math.random()'.

Ici, c'est des méthodes. (à appeler sur des objets donc).
### generateNoise()
Cette fonction génère le bruit de perlin.
Sans elle, la grille de vecteur servant à calculer la valeur d'un point est vide. Il est donc impératif d'appeler cette méthodes après la création de l'objet.

### getPerlin(x,y)
La fonction la plus intéressante.
À partir de 2 coordonnée x et y, elle vous donne la valeur de ce point dans le bruit. 
Attention !! Les paramètres doivent-être dans l'interval qui suit \]0;1\[.
**x**(float),**y**(float) : Deux nombres décimaux compris entre 0 et 1 exclus.

