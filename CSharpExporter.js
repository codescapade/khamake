"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const fs = require('fs-extra');
const path = require('path');
const KhaExporter_1 = require('./KhaExporter');
const Haxe_1 = require('./Haxe');
const ImageTool_1 = require('./ImageTool');
const HaxeProject_1 = require('./HaxeProject');
const uuid = require('./uuid.js');
class CSharpExporter extends KhaExporter_1.KhaExporter {
    constructor(options) {
        super(options);
    }
    includeFiles(dir, baseDir) {
        if (!dir || !fs.existsSync(dir))
            return;
        let files = fs.readdirSync(dir);
        for (var f in files) {
            let file = path.join(dir, files[f]);
            if (fs.existsSync(file) && fs.statSync(file).isDirectory())
                this.includeFiles(file, baseDir);
            else if (file.endsWith(".cs")) {
                this.p("<Compile Include=\"" + path.relative(baseDir, file).replace(/\//g, '\\') + "\" />", 2);
            }
        }
    }
    exportSolution(name, _targetOptions, defines) {
        return __awaiter(this, void 0, Promise, function* () {
            this.addSourceDirectory("Kha/Backends/" + this.backend());
            defines.push('no-root');
            defines.push('no-compilation');
            defines.push('sys_' + this.options.target);
            defines.push('sys_g1');
            defines.push('sys_g2');
            defines.push('sys_a1');
            const options = {
                from: this.options.from,
                to: path.join(this.sysdir() + '-build', 'Sources'),
                sources: this.sources,
                libraries: this.libraries,
                defines: defines,
                parameters: this.parameters,
                haxeDirectory: this.options.haxe,
                system: this.sysdir(),
                language: 'cs',
                width: this.width,
                height: this.height,
                name: name
            };
            yield HaxeProject_1.writeHaxeProject(this.options.to, options);
            fs.removeSync(path.join(this.options.to, this.sysdir() + '-build', 'Sources'));
            let result = yield Haxe_1.executeHaxe(this.options.to, this.options.haxe, ['project-' + this.sysdir() + '.hxml']);
            const projectUuid = uuid.v4();
            this.exportSLN(projectUuid);
            this.exportCsProj(projectUuid);
            this.exportResources();
        });
    }
    exportSLN(projectUuid) {
        this.writeFile(path.join(this.options.to, this.sysdir() + '-build', 'Project.sln'));
        const solutionUuid = uuid.v4();
        this.p("Microsoft Visual Studio Solution File, Format Version 11.00");
        this.p("# Visual Studio 2010");
        this.p("Project(\"{" + solutionUuid.toString().toUpperCase() + "}\") = \"HaxeProject\", \"Project.csproj\", \"{" + projectUuid.toString().toUpperCase() + "}\"");
        this.p("EndProject");
        this.p("Global");
        this.p("GlobalSection(SolutionConfigurationPlatforms) = preSolution", 1);
        this.p("Debug|x86 = Debug|x86", 2);
        this.p("Release|x86 = Release|x86", 2);
        this.p("EndGlobalSection", 1);
        this.p("GlobalSection(ProjectConfigurationPlatforms) = postSolution", 1);
        this.p("{" + projectUuid.toString().toUpperCase() + "}.Debug|x86.ActiveCfg = Debug|x86", 2);
        this.p("{" + projectUuid.toString().toUpperCase() + "}.Debug|x86.Build.0 = Debug|x86", 2);
        this.p("{" + projectUuid.toString().toUpperCase() + "}.Release|x86.ActiveCfg = Release|x86", 2);
        this.p("{" + projectUuid.toString().toUpperCase() + "}.Release|x86.Build.0 = Release|x86", 2);
        this.p("EndGlobalSection", 1);
        this.p("GlobalSection(SolutionProperties) = preSolution", 1);
        this.p("HideSolutionNode = FALSE", 2);
        this.p("EndGlobalSection", 1);
        this.p("EndGlobal");
        this.closeFile();
    }
    copySound(platform, from, to, encoders) {
        return __awaiter(this, void 0, void 0, function* () {
            return [to];
        });
    }
    copyImage(platform, from, to, asset) {
        return __awaiter(this, void 0, void 0, function* () {
            let format = ImageTool_1.exportImage(from, path.join(this.options.to, this.sysdir(), to), asset, undefined, false);
            return [to + '.' + format];
        });
    }
    copyBlob(platform, from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            fs.copySync(from, path.join(this.options.to, this.sysdir(), to), { clobber: true });
            return [to];
        });
    }
    copyVideo(platform, from, to, encoders) {
        return __awaiter(this, void 0, void 0, function* () {
            return [to];
        });
    }
}
exports.CSharpExporter = CSharpExporter;
//# sourceMappingURL=CSharpExporter.js.map