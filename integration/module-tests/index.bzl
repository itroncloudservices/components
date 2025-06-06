load("@aspect_rules_js//js:defs.bzl", "js_test")
load("@bazel_skylib//rules:write_file.bzl", "write_file")

def module_test(name, npm_packages, skipped_entry_points = [], additional_deps = [], **kwargs):
    write_file(
        name = "%s_config" % name,
        out = "%s_config.json" % name,
        content = [json.encode({
            "packages": [pkg[1] for pkg in npm_packages.items()],
            "skipEntryPoints": skipped_entry_points,
        })],
    )

    js_test(
        name = "test",
        data = [
            ":%s_config" % name,
            "//integration/module-tests:test_lib",
            "//:node_modules/@angular/common",
            "//:node_modules/@angular/core",
        ] + additional_deps + [pkg[0] for pkg in npm_packages.items()],
        entry_point = ":index.mjs",
        fixed_args = ["$(rootpath :%s_config)" % name],
        **kwargs
    )
