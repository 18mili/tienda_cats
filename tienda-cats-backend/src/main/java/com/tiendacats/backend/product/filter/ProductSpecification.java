package com.tiendacats.backend.product.filter;

import com.tiendacats.backend.product.model.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasCategoria(String categoria) {
        return (root, query, cb) ->
                (categoria == null || categoria.isBlank())
                        ? null
                        : cb.equal(cb.lower(root.get("categoria")), categoria.toLowerCase());
    }

    public static Specification<Product> nombreLike(String nombre) {
        return (root, query, cb) ->
                (nombre == null || nombre.isBlank())
                        ? null
                        : cb.like(cb.lower(root.get("nombre")), "%" + nombre.toLowerCase() + "%");
    }

    public static Specification<Product> precioMin(Integer minPrecio) {
        return (root, query, cb) ->
                (minPrecio == null)
                        ? null
                        : cb.greaterThanOrEqualTo(root.get("precio"), minPrecio);
    }

    public static Specification<Product> precioMax(Integer maxPrecio) {
        return (root, query, cb) ->
                (maxPrecio == null)
                        ? null
                        : cb.lessThanOrEqualTo(root.get("precio"), maxPrecio);
    }
}
